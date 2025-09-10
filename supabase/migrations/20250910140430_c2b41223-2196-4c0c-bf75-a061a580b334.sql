-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.households DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Household members can view their household" ON public.households;
DROP POLICY IF EXISTS "Household admins can update household" ON public.households;
DROP POLICY IF EXISTS "Users can create households" ON public.households;
DROP POLICY IF EXISTS "Users can view household members they belong to" ON public.household_members;
DROP POLICY IF EXISTS "Users can insert themselves as household members" ON public.household_members;
DROP POLICY IF EXISTS "Household admins can update members" ON public.household_members;
DROP POLICY IF EXISTS "Household admins can delete members" ON public.household_members;
DROP POLICY IF EXISTS "Household members can view accounts" ON public.accounts;
DROP POLICY IF EXISTS "Household members can manage accounts" ON public.accounts;
DROP POLICY IF EXISTS "Household members can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Household members can manage transactions" ON public.transactions;

-- Drop household-related tables and functions
DROP FUNCTION IF EXISTS public.get_user_household_role(UUID, UUID);
DROP FUNCTION IF EXISTS public.is_household_member(UUID, UUID);
DROP TABLE IF EXISTS public.household_members;
DROP TABLE IF EXISTS public.households;

-- Modify accounts table to link directly to users
ALTER TABLE public.accounts DROP COLUMN IF EXISTS household_id;
ALTER TABLE public.accounts ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE;

-- Modify transactions table to link directly to users (already has user_id)
ALTER TABLE public.transactions DROP COLUMN IF EXISTS household_id;