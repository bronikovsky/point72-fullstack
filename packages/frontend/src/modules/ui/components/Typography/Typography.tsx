import * as React from 'react';
import classes from './Typography.module.scss';
import classnames from 'classnames';

export type Props = {
  children: NonNullable<React.ReactNode>;
  className?: string;
  html?: boolean;
  variant?: 'heading' | 'subheading' | 'button' | 'overline' | 'body';
  element?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'primary' | 'error' | 'lighter' | 'success';
  style?: React.CSSProperties;
}

const Typography = (props: Props): React.ReactElement => {
  const { children, className, html, style, element: El = 'div', variant = 'body', color = 'default' } = props;
  const rootClass = classnames(classes.root, classes[variant], classes[color], className);

  if (html) {
    if (typeof children !== 'string') {
      throw new Error('Cannot render non-string children as html.');
    }

    return (
      <El
        className={rootClass}
        dangerouslySetInnerHTML={{ __html: children }}
        style={style}
      />
    );
  }

  return (
    <El className={rootClass} style={style}>
      {children}
    </El>
  );
};

export default Typography;
