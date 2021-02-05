import * as React from 'react';
import debounce from 'debounce-promise';

type Validator = (value: string) => Promise<string | void | undefined | null>;

export default function useAsyncValidator(validator: Validator, deps: React.DependencyList, timeout = 300): Validator {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidator = React.useCallback(debounce(validator, timeout), [validator, timeout]);

  return React.useCallback(async (value: string): Promise<string | undefined | void | null> => {
    if (!value) {
      return null;
    }

    return debouncedValidator(value);
  }, [debouncedValidator]);
}
