import * as React from 'react';
import classes from '../../themes.module.scss';
import useTheme from '../../hooks/useTheme';

type Props = {
  children: React.ReactElement;
};

const ThemedContainer = (props: Props): React.ReactElement => {
  const { children } = props;
  const theme = useTheme();
  const className = theme === 'dark' ? classes.darkTheme : classes.lightTheme;

  React.useEffect(() => {
    const root = document.querySelector('#app') as HTMLDivElement;

    root.classList.remove(classes.darkTheme);
    root.classList.remove(classes.lightTheme);
    root.classList.add(className);
  }, [className]);

  return children;
};

export default ThemedContainer;
