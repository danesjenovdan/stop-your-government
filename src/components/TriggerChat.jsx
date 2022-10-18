import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../utils/hooks.js';
import { getStoryLink } from '../utils/links.js';
import {
  getUnlockedChapters,
  setUnlockedChapters,
} from '../utils/variables.js';
import { Button } from './Button.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import styles from './TriggerChat.module.scss';

export const TriggerChat = ({ story, chat }) => {
  const history = useHistory();
  const query = useQuery();
  const lang = query.get('lang');

  useEffect(() => {
    const chapters = getUnlockedChapters();
    chapters[story._id] = chapters[story._id] || [];
    if (!chapters[story._id].includes(chat._id)) {
      chapters[story._id].push(chat._id);
      setUnlockedChapters(chapters);
    }
  }, []);

  const onClick = () => {
    return history.push(getStoryLink(story._id, lang));
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
