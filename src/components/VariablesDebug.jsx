import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  deleteStoredVariables,
  getStoredVariables,
} from '../utils/variables.js';
import styles from './VariablesDebug.module.scss';

export const VariablesDebug = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [variables, setVariables] = useState(null);

  const onDeleteClick = () => {
    deleteStoredVariables();
  };

  const onCollapsedClick = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setVariables(getStoredVariables());
  }, []);

  useEffect(() => {
    const updateVariables = (event) => setVariables(event.detail);

    window.addEventListener('x-variables-changed', updateVariables);

    return () => {
      window.removeEventListener('x-variables-changed', updateVariables);
    };
  }, [variables, setVariables]);

  if (collapsed) {
    return (
      <div className={classNames(styles.variables, styles.collapsed)}>
        <button type="button" onClick={onCollapsedClick}>
          +
        </button>
      </div>
    );
  }

  return (
    <div className={styles.variables}>
      <div>
        {variables &&
          Object.entries(variables).map(([k, v]) => (
            <div key={k}>
              {k}: {v}
              <br />
            </div>
          ))}
      </div>
      <div>
        <button type="button" onClick={onDeleteClick}>
          Delete all variables
        </button>
      </div>
      <div>
        <button type="button" onClick={onCollapsedClick}>
          -
        </button>
      </div>
    </div>
  );
};
