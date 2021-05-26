import React from 'react';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import styles from './StoryPoster.module.scss';

export const StoryPoster = ({ poster }) => {
  return (
    <div className={styles.poster}>
      {!!poster && <ImageWithPreview image={poster} className={styles.image} />}
    </div>
  );
};
