import * as React from 'react';
import { BrightnessHigh, BrightnessLow } from '@material-ui/icons';
import { Button } from '../../../ui';
import { msg } from '../../../localization';
import { useTheme, useThemeToggle } from '../../../theme';
import classes from './ThemeToggle.module.scss';

const ThemeToggle = (): React.ReactElement => {
  const theme = useTheme();
  const toggleTheme = useThemeToggle();
  const Icon = theme === 'dark' ? BrightnessLow : BrightnessHigh;

  return (
    <Button className={classes.root} StartIcon={Icon} onClick={toggleTheme}>
      {msg(`theme.${theme}`)}
    </Button>
  );
};

export default ThemeToggle;
