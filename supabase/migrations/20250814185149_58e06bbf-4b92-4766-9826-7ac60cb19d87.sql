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

-- RLS Policies for households
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

-- Household-based tables policies
CREATE POLICY "Users can access their household accounts" ON public.accounts
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household categories" ON public.categories
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household cost_centers" ON public.cost_centers
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household debts" ON public.debts
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household goals" ON public.goals
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household installments" ON public.installments
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household inventory" ON public.inventory_items
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household notes" ON public.notes
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household price_history" ON public.price_history
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household products_catalog" ON public.products_catalog
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household projections_cache" ON public.projections_cache
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household projects" ON public.projects
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household purchases" ON public.purchases
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household recurrences" ON public.recurrences
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household reports" ON public.reports
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household secure_documents" ON public.secure_documents
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household shopping_lists" ON public.shopping_lists
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household subscriptions" ON public.subscriptions
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household transactions" ON public.transactions
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can access their household trips" ON public.trips
FOR ALL USING (
  household_id IN (
    SELECT household_id FROM public.household_members 
    WHERE user_id = auth.uid()
  )
);

-- Special policies for tables without household_id
CREATE POLICY "Users can access debt_payments" ON public.debt_payments
FOR ALL USING (
  debt_id IN (
    SELECT id FROM public.debts 
    WHERE household_id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can access trip_expenses" ON public.trip_expenses
FOR ALL USING (
  trip_id IN (
    SELECT id FROM public.trips 
    WHERE household_id IN (
      SELECT household_id FROM public.household_members 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can access shopping_list_items" ON public.shopping_list_items
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

-- Policy for app_users
CREATE POLICY "Users can view their data" ON public.app_users
  FOR ALL USING (id = auth.uid());