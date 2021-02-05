import './overrides.scss';
import * as React from 'react';
import classes from './Slider.module.scss';
import classnames from 'classnames';
import ReactSlider  from 'react-slider';
import Thumb from './Thumb';

type Props = ReactSlider.ReactSliderProps & {
  label: string;
  className?: string;
  renderThumb?: never;
}

const Slider = (props: Props): React.ReactElement => {
  const { className, label, ...sliderProps } = props;

  return (
    <div className={classnames(className, classes.root)}>
      <div className={classes.label}>
        {label}
      </div>
      <ReactSlider
        className={'react-slider'}
        renderThumb={(props, state) => (
          <Thumb
            {...props}
            ref={typeof props.ref === 'string' ? undefined : props.ref}
            {...state}
          />
        )}
        {...sliderProps}
      />
    </div>
  );
};

export default Slider;
