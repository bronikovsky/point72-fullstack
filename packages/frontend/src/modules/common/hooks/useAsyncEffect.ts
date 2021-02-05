import * as React from 'react';

export default function useAsyncEffect(effect: () => Promise<void>, deps?: React.DependencyList): void {
  React.useEffect(() => {
    effect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
