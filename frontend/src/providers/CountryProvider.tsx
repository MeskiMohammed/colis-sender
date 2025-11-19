import React, { createContext, useContext, useState } from 'react';

type CountryContextType = {
  country: string;
  setCountry: (country: 'morocco' | 'france') => void;
};

const CountryContext = createContext({} as CountryContextType);

export const CountryProvider = ({ children }:{children: React.ReactNode}) => {
  const [country, setCountry] = useState<'morocco' | 'france'>('morocco');

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
