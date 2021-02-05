import * as React from 'react';
import { useAsyncEffect } from '../common';
import useFetchCountries from './hooks/useFetchCountries';

type Context = {
  countries: string[];
}

const DictionariesContext = React.createContext<Context>({ countries: [] });

type Props = {
  children: React.ReactNode;
}

export const DictionariesProvider = (props: Props): React.ReactElement => {
  const { children } = props;
  const [fetchCountries] = useFetchCountries();
  const [countries, setCountries] = React.useState<string[]>([]);

  useAsyncEffect(async () => {
    setCountries(await fetchCountries());
  }, []);

  return (
    <DictionariesContext.Provider value={{ countries }}>
      {children}
    </DictionariesContext.Provider>
  );
};

export const useDictionaries = (): Context => React.useContext(DictionariesContext);
