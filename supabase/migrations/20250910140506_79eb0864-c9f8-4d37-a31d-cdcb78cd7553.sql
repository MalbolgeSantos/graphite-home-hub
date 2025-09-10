-- Drop foreign key constraints first
ALTER TABLE public.accounts DROP CONSTRAINT IF EXISTS accounts_household_id_fkey;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_household_id_fkey;

-- Drop household columns
ALTER TABLE public.accounts DROP COLUMN IF EXISTS household_id;
ALTER TABLE public.transactions DROP COLUMN IF EXISTS household_id;

-- Add user_id to accounts if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='accounts' AND column_name='user_id') THEN
    ALTER TABLE public.accounts ADD COLUMN user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE;
  END IF;
END $$;

-- Drop household-related tables now
DROP TABLE IF EXISTS public.household_members CASCADE;
DROP TABLE IF EXISTS public.households CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.get_user_household_role(UUID, UUID);
DROP FUNCTION IF EXISTS public.is_household_member(UUID, UUID);