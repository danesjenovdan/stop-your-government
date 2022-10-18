import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../utils/hooks.js';
import { getStoryLink } from '../utils/links.js';
import {
  getCompletedChapters,
  getUnlockedChapters,
  setCompletedChapters,
  setUnlockedChapters,
} from '../utils/variables.js';
import { Button } from './Button.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import styles from './TriggerChat.module.scss';

export const TriggerChat = ({ story, chat, triggerChat }) => {
  const history = useHistory();
  const query = useQuery();
  const lang = query.get('lang');

  useEffect(() => {
    const unlockedChapters = getUnlockedChapters();
    unlockedChapters[story._id] = unlockedChapters[story._id] || [];
    if (!unlockedChapters[story._id].includes(triggerChat._id)) {
      unlockedChapters[story._id].push(triggerChat._id);
      setUnlockedChapters(unlockedChapters);
    }

    const completedChapters = getCompletedChapters();
    completedChapters[story._id] = completedChapters[story._id] || [];
    if (!completedChapters[story._id].includes(chat._id)) {
      completedChapters[story._id].push(chat._id);
      setCompletedChapters(completedChapters);
    }
  }, []);

  const onClick = () => {
    return history.push(getStoryLink(story._id, lang));
  };

  return (
    <div className={styles.triggerChat}>
      {!!triggerChat?.poster && (
        <div className={styles.imageContainer}>
          <ImageWithPreview
            image={triggerChat.poster}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.buttonContainer}>
        <Button onClick={onClick}>{triggerChat.title}</Button>
      </div>
    </div>
  );
};
