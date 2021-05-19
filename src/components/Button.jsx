import classNames from 'classnames';
import React from 'react';
import styles from './Button.module.scss';

export const Button = ({ children, style, className, ...props }) => {
  return (
    <button
      type="button"
      style={style}
      className={classNames(styles.button, className)}
      {...props}
    >
      {children}
    </button>
  );
};
