import React from 'react';
import { Button } from './Button.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import styles from './TriggerChat.module.scss';

export const TriggerChat = ({ chat }) => {
  return (
    <div className={styles.triggerChat}>
      <div className={styles.imageContainer}>
        <ImageWithPreview image={chat.poster} className={styles.image} />
      </div>
      <div className={styles.buttonContainer}>
        <Button>{chat.title}</Button>
      </div>
    </div>
  );
};
