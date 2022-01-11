import React from 'react';
import { useHistory } from 'react-router-dom';
import { getChatLink } from '../utils/links.js';
import { Button } from './Button.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import styles from './TriggerChat.module.scss';

export const TriggerChat = ({ story, chat }) => {
  const history = useHistory();

  const onClick = () => {
    return history.push(getChatLink(story._id, chat._id));
  };

  return (
    <div className={styles.triggerChat}>
      {!!chat?.poster && (
        <div className={styles.imageContainer}>
          <ImageWithPreview image={chat.poster} className={styles.image} />
        </div>
      )}
      <div className={styles.buttonContainer}>
        <Button onClick={onClick}>{chat.title}</Button>
      </div>
    </div>
  );
};
