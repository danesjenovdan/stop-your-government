import classNames from 'classnames';
import React from 'react';
import styles from './Button.module.scss';

export const Button = ({
  children,
  variant = 'default',
  style,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      style={style}
      className={classNames(
        { [styles.button]: true, [styles.buttonGold]: variant === 'gold' },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
