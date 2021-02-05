import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '../index';
import slice from '../slice';

export default function useThemeToggle(): (() => void) {
  const theme = useTheme();
  const dispatch = useDispatch();

  return React.useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    dispatch(slice.actions.setTheme(nextTheme));
  }, [dispatch, theme]);
}
