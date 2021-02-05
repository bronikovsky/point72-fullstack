import './overrides.scss';
import * as React from 'react';
import ReactSelect, { Props as SelectProps } from 'react-select';

type Props = SelectProps & {
  className?: never;
  classNamePrefix?: never;
}

const Select = (props: Props): React.ReactElement => {
  return <ReactSelect className={'react-select-container'} classNamePrefix={'react-select'} {...props}/>;
};

export default Select;
