import * as React from 'react';
import { msg } from '../../../localization';
import classes from './TextField.module.scss';
import classnames from 'classnames';
import VisibilityToggle from './VisibilityToggle';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  pending?: boolean;
  error?: string | null;
  StartIcon?: React.ComponentType;
  visibilityToggle?: boolean;
}

const TextField = (props: Props): React.ReactElement => {
  const { name, label = msg(`form.${name}.label`), id = name, pending, error, visibilityToggle, StartIcon = null, ...inputProps } = props;
  const { onFocus: _onFocus, onBlur: _onBlur } = inputProps;
  const [focused, setFocused] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const onFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    _onFocus && _onFocus(e);
  }, [_onFocus]);

  const onBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    _onBlur && _onBlur(e);
  }, [_onBlur]);

  const onToggleVisibility = React.useCallback(() => {
    setIsVisible(v => !v);
  }, []);

  const rootClass = classnames(
    classes.root,
    props.className,
    {
      [classes.focused]: focused,
      [classes.empty]: !props.value,
      [classes.startIcon]: StartIcon,
      [classes.pending]: pending,
      [classes.error]: error,
      [classes.visibilityToggle]: visibilityToggle,
    },
  );

  const errorMessage = error ? msg([`form.${props.name}.errors.${error}`,`form.errors.${error}`]) : '';
  const finalInputProps = isVisible ? { ...inputProps, type: 'text' } : inputProps;

  return (
    <div className={rootClass}>
      {StartIcon && <StartIcon/>}
      <input id={id} {...finalInputProps} onFocus={onFocus} onBlur={onBlur}/>
      <label htmlFor={id}>
        {`${label}${errorMessage ? ` / ${errorMessage}` : ''}`}
      </label>
      {visibilityToggle && (
        <VisibilityToggle
          className={classes.visibilityToggle}
          visible={isVisible}
          onClick={onToggleVisibility}
        />
      )}
    </div>
  );
};

export default TextField;
