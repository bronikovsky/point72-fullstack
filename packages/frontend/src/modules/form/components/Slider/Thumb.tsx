import * as React from 'react';
import { Typography } from '../../../ui';
import classes from './Thumb.module.scss';
import classnames from 'classnames';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  valueNow: number;
}

const Thumb = React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>): React.ReactElement => {
  const { valueNow, className, ...divProps } = props;

  return (
    <div className={classnames(classes.root, className)} ref={ref} {...divProps}>
      <Typography variant={'overline'} className={classes.tooltip}>
        {valueNow}
      </Typography>
    </div>
  );
});

export default Thumb;
