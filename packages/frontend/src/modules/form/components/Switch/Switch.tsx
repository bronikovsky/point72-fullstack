import * as React from 'react';
import classes from './Switch.module.scss';

type Props = {
  children: React.ReactNode;
}

const Switch = (props: Props): React.ReactElement => {
  const { children } = props;

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default Switch;
