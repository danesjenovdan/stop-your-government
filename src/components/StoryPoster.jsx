import React from 'react';
import styles from './StoryPoster.module.scss';

export const StoryPoster = ({ poster }) => {
  if (poster.type !== 'IMAGE' || !poster.url) {
    return null;
  }

  const ratio = (poster.height / poster.width) * 100;

  return (
    <div
      className={styles.poster}
      style={{
        backgroundImage: `url("${poster.url}")`,
        paddingTop: `${ratio}%`,
      }}
    />
  );
};
