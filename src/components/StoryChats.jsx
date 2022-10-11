import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../utils/hooks.js';
import styles from './StoryChats.module.scss';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import stopSign from '../assets/img/stop-sign-pole-bird.png';
import { getChatLink } from '../utils/links.js';
import {
  getUnlockedChapters,
  setUnlockedChapters,
} from '../utils/variables.js';

const ChatButton = ({ story, chat, index, unlocked }) => {
  const history = useHistory();
  const query = useQuery();
  const lang = query.get('lang');

  const onChatClick = () => {
    if (unlocked) {
      const chatLink = getChatLink(story._id, chat._id, lang);
      history.push(chatLink);
    }
  };

  return (
    <button
      type="button"
      className={classNames({
        [styles.button]: true,
        [styles.unlocked]: unlocked,
      })}
      onClick={() => onChatClick(chat._id)}
    >
      {!!unlocked && chat.poster && (
        <ImageWithPreview image={chat.poster} className={styles.bgImage} />
      )}
      <div className={styles.number}>{index}</div>
    </button>
  );
};

export const StoryChats = ({ story, character }) => {
  const [unlockedStoryChapters, setUnlockedStoryChapters] = useState([]);
  const mainChat = story.chats.find((c) => c.isMainChat);

  useEffect(() => {
    const chapters = getUnlockedChapters();
    chapters[story._id] = chapters[story._id] || [];
    if (mainChat && !chapters[story._id].includes(mainChat._id)) {
      chapters[story._id].push(mainChat._id);
      setUnlockedChapters(chapters);
    }
    setUnlockedStoryChapters(chapters[story._id]);
  }, []);

  return (
    <div className={styles.storyChats}>
      <div className={styles.glow} />
      <div className={styles.image}>
        <img src={stopSign} alt="" />
      </div>
      <div className={styles.header}>
        <div className={styles.name}>
          <div>{character.name}</div>
          <div className={styles.theme}>{character.theme}</div>
        </div>
      </div>
      <div className={styles.buttons}>
        {story?.chats.map((chat, i) => (
          <ChatButton
            key={chat._id}
            story={story}
            chat={chat}
            index={i + 1}
            unlocked={unlockedStoryChapters.includes(chat._id)}
          />
        ))}
      </div>
    </div>
  );
};
