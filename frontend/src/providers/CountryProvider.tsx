import React, { createContext, useContext, useState } from 'react';

type CountryContextType = {
  country: Country;
  setCountry: (country: Country) => void;
};
type Country = 'Morocco' | 'France'

const CountryContext = createContext({} as CountryContextType);

export const CountryProvider = ({ children }:{children: React.ReactNode}) => {
  const [country, setCountry] = useState<Country>('Morocco');

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
