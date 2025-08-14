import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

interface Household {
  id: string;
  name: string;
  currency: string;
  timezone: string;
}

interface HouseholdContextType {
  household: Household | null;
  loading: boolean;
  createHousehold: (name: string) => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType>({
  household: null,
  loading: true,
  createHousehold: async () => {},
});

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
};

interface HouseholdProviderProps {
  children: React.ReactNode;
}

export const HouseholdProvider = ({ children }: HouseholdProviderProps) => {
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadHousehold();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadHousehold = async () => {
    try {
      // Get user's household through household_members
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select(`
          household_id,
          role,
          households (
            id,
            name,
            currency,
            timezone
          )
        `)
        .eq('user_id', user?.id)
        .single();

      if (memberError) {
        if (memberError.code === 'PGRST116') {
          // No household found, user needs to create one
          setHousehold(null);
        } else {
          throw memberError;
        }
      } else if (memberData?.households) {
        setHousehold(memberData.households as Household);
      }
    } catch (error: any) {
      console.error('Error loading household:', error);
      toast({
        title: "Erro ao carregar família",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHousehold = async (name: string) => {
    try {
      // Create household
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .insert({ name })
        .select()
        .single();

      if (householdError) throw householdError;

      // Add user as admin member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert({
          household_id: householdData.id,
          user_id: user?.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      setHousehold(householdData);
      
      toast({
        title: "Família criada!",
        description: `A família "${name}" foi criada com sucesso.`,
      });
    } catch (error: any) {
      console.error('Error creating household:', error);
      toast({
        title: "Erro ao criar família",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    household,
    loading,
    createHousehold,
  };

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
};