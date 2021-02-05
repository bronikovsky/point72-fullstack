import * as React from 'react';

type Props = Omit<React.SVGAttributes<HTMLOrSVGElement>, 'xmlns'>

const Svg = (props: Props): React.ReactElement => {
  return <svg xmlns={'http://www.w3.org/2000/svg'} {...props}/>;
};

export default Svg;
