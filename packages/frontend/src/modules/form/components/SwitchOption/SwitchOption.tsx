import * as React from 'react';
import { Button } from '../../../ui';
import { msg } from '../../../localization';
import classes from './SwitchOption.module.scss';
import classnames from 'classnames';

type Props = {
  name: string;
  onChange: (e: React.ChangeEvent) => void;
  value: string;
  checked?: boolean;
}

const SwitchOption = (props: Props): React.ReactElement => {
  const { name, value, checked, onChange } = props;
  const id = `${name}_${value}`;
  const rootClass = classnames(classes.root, { [classes.checked]: checked });
  const labelRef = React.useRef<HTMLLabelElement | null>(null);

  const onClick = React.useCallback(() => {
    if (labelRef.current) {
      labelRef.current.click();
    }
  }, []);

  return (
    <label htmlFor={id} className={rootClass} ref={labelRef}>
      <Button variant={'embedded'} color={'primary'} fullWidth onClick={onClick}>
        {msg(`form.${name}.options.${value}`)}
      </Button>
      <input
        id={id}
        type={'radio'}
        name={name}
        onChange={onChange}
        value={value}
        checked={checked}
      />
    </label>
  );
};

export default SwitchOption;
