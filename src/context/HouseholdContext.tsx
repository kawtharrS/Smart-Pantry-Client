import { createContext, useContext, useState, type ReactNode, type JSX } from 'react';

interface Household {
  id: number;
  name: string;
}

interface HouseholdContextType {
  household: Household | null;
  setHouseholdData: (householdData: Household) => void;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

interface HouseholdProviderProps {
  children: ReactNode;
}

export const HouseholdProvider = ({ children }: HouseholdProviderProps): JSX.Element => {
  const [household, setHousehold] = useState<Household | null>(() => {
    const storedHousehold = localStorage.getItem('household');
    return storedHousehold ? JSON.parse(storedHousehold) : null;
  });

  const setHouseholdData = (householdData: Household): void => {
    setHousehold(householdData);
    localStorage.setItem('household', JSON.stringify(householdData));
  };

  return (
    <HouseholdContext.Provider value={{ household, setHouseholdData }}>
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = (): HouseholdContextType => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
};
