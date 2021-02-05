import * as React from 'react';
import { SvgIconProps } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

type Props = SvgIconProps & {
  visible: boolean;
}

const VisibilityToggle = (props: Props): React.ReactElement => {
  const { visible, ...iconProps } = props;

  return visible ? <VisibilityOff {...iconProps}/> : <Visibility {...iconProps}/>;
};

export default VisibilityToggle;
