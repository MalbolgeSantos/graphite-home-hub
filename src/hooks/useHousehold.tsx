import { createContext, useContext } from "react";

interface UserContextType {
  // Simple context for user data if needed in the future
}

const UserContext = createContext<UserContextType>({});

export const useHousehold = () => {
  // Return empty object to maintain compatibility
  return { household: { id: 'user' }, loading: false };
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const HouseholdProvider = ({ children }: UserProviderProps) => {
  return (
    <UserContext.Provider value={{}}>
      {children}
    </UserContext.Provider>
  );
};