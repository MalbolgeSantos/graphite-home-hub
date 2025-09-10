-- First drop all remaining policies that depend on household_id
DROP POLICY IF EXISTS "Household members can view accounts" ON public.accounts;
DROP POLICY IF EXISTS "Household members can manage accounts" ON public.accounts;
DROP POLICY IF EXISTS "Household members can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Household members can manage transactions" ON public.transactions;

-- Now we can safely drop the columns
ALTER TABLE public.accounts DROP COLUMN household_id CASCADE;
ALTER TABLE public.transactions DROP COLUMN household_id CASCADE;

-- Add user_id to accounts table
ALTER TABLE public.accounts ADD COLUMN user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE;

-- Drop the remaining tables
DROP TABLE IF EXISTS public.household_members CASCADE;
DROP TABLE IF EXISTS public.households CASCADE;