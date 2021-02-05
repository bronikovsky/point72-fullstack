import * as React from 'react';
import { Typography } from '../../../ui';
import classes from './PageHeader.module.scss';

type Props = {
  title: string;
  Icon: React.ElementType;
}

const PageHeader = (props: Props): React.ReactElement => {
  const { Icon, title } = props;

  return (
    <div className={classes.root}>
      <Icon/>
      <Typography variant={'heading'}>
        {title}
      </Typography>
    </div>
  );
};

export default PageHeader;
