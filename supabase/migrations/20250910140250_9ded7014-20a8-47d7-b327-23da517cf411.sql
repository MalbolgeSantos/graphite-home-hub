-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Household members can view members" ON public.household_members;
DROP POLICY IF EXISTS "Household admins can manage members" ON public.household_members;

-- Create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_household_role(user_uuid UUID, household_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.household_members 
    WHERE user_id = user_uuid AND household_id = household_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_household_member(user_uuid UUID, household_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.household_members 
    WHERE user_id = user_uuid AND household_id = household_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create new safe policies for household_members
CREATE POLICY "Users can view household members they belong to" ON public.household_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    public.is_household_member(auth.uid(), household_id)
  );

CREATE POLICY "Users can insert themselves as household members" ON public.household_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Household admins can update members" ON public.household_members
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    public.get_user_household_role(auth.uid(), household_id) = 'admin'
  );

CREATE POLICY "Household admins can delete members" ON public.household_members
  FOR DELETE USING (
    user_id = auth.uid() OR 
    public.get_user_household_role(auth.uid(), household_id) = 'admin'
  );