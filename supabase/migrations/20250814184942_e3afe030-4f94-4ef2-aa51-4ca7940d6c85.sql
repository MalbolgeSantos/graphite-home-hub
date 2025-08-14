-- Enable RLS on all tables for security
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projections_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secure_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for households (users can access their own household)
CREATE POLICY "Users can view their household" ON public.households
  FOR SELECT USING (
    id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create households" ON public.households
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their household" ON public.households
  FOR UPDATE USING (
    id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for household_members
CREATE POLICY "Users can view household members" ON public.household_members
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert household members" ON public.household_members
  FOR INSERT WITH CHECK (
    household_id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Generic RLS policy for all household-based tables
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'accounts', 'categories', 'cost_centers', 'debt_payments', 'debts',
        'goals', 'installments', 'inventory_items', 'notes', 'price_history',
        'products_catalog', 'projections_cache', 'projects', 'purchases',
        'recurrences', 'reports', 'secure_documents', 'shopping_lists',
        'subscriptions', 'transactions', 'trip_expenses', 'trips'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            CREATE POLICY "Users can access their household data" ON public.%I
            FOR ALL USING (
                household_id IN (
                    SELECT household_id FROM public.household_members 
                    WHERE user_id = auth.uid()
                )
            )
        ', table_name);
    END LOOP;
END $$;

-- Special policy for shopping_list_items (joins through shopping_lists)
CREATE POLICY "Users can access their household shopping list items" ON public.shopping_list_items
FOR ALL USING (
  list_id IN (
    SELECT id FROM public.shopping_lists 
    WHERE household_id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- Policy for user_settings
CREATE POLICY "Users can manage their settings" ON public.user_settings
  FOR ALL USING (user_id = auth.uid());

-- Policy for app_users (if still needed)
CREATE POLICY "Users can view their data" ON public.app_users
  FOR ALL USING (id = auth.uid());