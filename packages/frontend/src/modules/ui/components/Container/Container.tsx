import * as React from 'react';
import classes from './Container.module.scss';
import classnames from 'classnames';

type Props = {
  children: NonNullable<React.ReactNode>;
  topPadding?: boolean;
  className?: string;
}

const Container = (props: Props): React.ReactElement => {
  const { children, topPadding, className } = props;

  return (
    <div className={classnames(classes.root, className, { [classes.topPadding]: topPadding })}>
      {children}
    </div>
  );
};

export default Container;
