import * as React from 'react';
import classes from './Button.module.scss';
import classnames from 'classnames';
import Typography from '../Typography';

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: NonNullable<React.ReactNode>;
  fullWidth?: boolean;
  condensed?: boolean;
  variant?: 'filled' | 'embedded' | 'outlined';
  color?: 'primary' | 'error';
  StartIcon?: React.ComponentType<{ className: string }>;
}

const Button = (props: Props): React.ReactElement => {
  const { StartIcon, className, children, variant = 'filled', color = 'default', fullWidth, condensed, ...buttonProps } = props;
  const conditionalClasses = { [classes.condensed]: condensed, [classes.fullWidth]: fullWidth };
  const rootClass = classnames(classes.root, classes[variant], classes[color], className, conditionalClasses);

  return (
    <button type={'button'} className={rootClass} {...buttonProps}>
      <Typography variant={'button'} className={classes.content}>
        {StartIcon && <StartIcon className={classes.icon}/>}
        {children}
      </Typography>
    </button>
  );
};

export default Button;
