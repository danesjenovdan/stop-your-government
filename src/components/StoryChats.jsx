import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../utils/hooks.js';
import styles from './StoryChats.module.scss';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import stopSign from '../assets/img/stop-sign-pole-bird.png';
import check from '../assets/img/check.png';
import { getChatLink } from '../utils/links.js';
import {
  getCompletedChapters,
  getUnlockedChapters,
  setUnlockedChapters,
} from '../utils/variables.js';
import { Button } from './Button.jsx';

const langToUrl = {
  slv: '/',
  hrv: '/hr',
  srp: '/sr',
};

const ChatButton = ({ story, chat, index, unlocked, completed }) => {
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
        [styles.completed]: completed,
      })}
      onClick={() => onChatClick(chat._id)}
    >
      {!!unlocked && chat.poster && (
        <ImageWithPreview image={chat.poster} className={styles.bgImage} />
      )}
      <div className={styles.number}>{index}</div>
      {!!completed && (
        <img src={check} alt="" className={styles.completedIcon} />
      )}
    </button>
  );
};

export const StoryChats = ({ story, character }) => {
  const history = useHistory();
  const query = useQuery();
  const lang = query.get('lang');

  const [unlockedStoryChapters, setUnlockedStoryChapters] = useState([]);
  const [completedStoryChapters, setCompletedStoryChapters] = useState([]);
  const mainChat = story.chats.find((c) => c.isMainChat);

  useEffect(() => {
    const unlockedChapters = getUnlockedChapters();
    unlockedChapters[story._id] = unlockedChapters[story._id] || [];
    if (mainChat && !unlockedChapters[story._id].includes(mainChat._id)) {
      unlockedChapters[story._id].push(mainChat._id);
      setUnlockedChapters(unlockedChapters);
    }
    setUnlockedStoryChapters(unlockedChapters[story._id]);

    const completedChapters = getCompletedChapters();
    completedChapters[story._id] = completedChapters[story._id] || [];
    setCompletedStoryChapters(completedChapters[story._id]);
  }, []);

  const onHomeClick = () => {
    return history.push(langToUrl[lang]);
  };

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
      <Button className={styles.homeButton} onClick={onHomeClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="163.42 171.7 426.39 407"
          fill="currentColor"
        >
          <path d="M585.8 362.27c-26.52-20.36-51.15-43.1-74.82-66.77a2105.24 2105.24 0 0 1-2.37-94.72c0-15.15-23.68-15.15-23.68 0 0 23.2.47 46.88 1.42 70.1-33.62-33.16-66.77-66.78-104.19-95.67-3.79-2.84-9.94-5.21-14.2-1.9-76.26 56.83-143.5 122.18-201.76 197.01-9.47 11.84 7.58 28.89 16.58 16.58a1050.61 1050.61 0 0 1 35.04-42.62c-.47 74.35-1.42 148.23-1.42 222.58 0 6.63 5.21 11.84 11.84 11.84h285.1c6.16 0 11.84-5.21 11.84-11.84-2.84-79.1-9-158.18-12.78-237.27a814.7 814.7 0 0 0 56.83 49.25c11.36 9 28.41-7.58 16.57-16.58zm-233 134.02c-.47-8.52-.47-17.05-.47-25.57 0-13.73 1.9-9.47 15.15-9.95 7.58-.47 15.63-.94 23.21-1.42 2.37 0 1.9 21.31 1.9 25.1.47 22.26.47 45 0 67.25 0 1.43 0 2.37.47 3.8h-36a631.94 631.94 0 0 1-4.26-59.2zm148.23 58.73h-85.72c.47-.95.47-2.37.47-3.8.48-30.77.48-61.56-.47-92.34-.47-24.63-21.31-23.68-40.73-22.73-16.1.95-44.04-2.37-45.93 20.36-2.84 32.2.94 66.3 4.26 98.5h-92.82c0-79.08 1.42-158.17 1.9-237.26 40.25-43.57 83.82-83.36 131.17-118.87 40.73 32.67 76.72 70.56 114.13 107.03 3.79 82.88 10.42 165.75 13.73 249.1z" />
          <path d="M315.86 341.9c-6.16 16.57 1.42 36 16.1 43.57a10.74 10.74 0 0 0 8.53 4.26c24.62.95 56.82-1.9 66.3-29.83 8.05-24.16-9-43.57-32.68-46.41-21.78-2.37-49.72 6.15-58.25 28.41zm65.36 16.1c-7.11 8.05-19.42 9-30.31 8.53-1.43-.95-3.32-1.43-5.69-1.43-10.89-.47-8.05-14.68-3.31-19.89 7.1-7.58 19.41-8.52 28.88-8.05 12.32.48 18.95 10.42 10.42 20.84z" />
        </svg>
      </Button>
      <div className={styles.buttons}>
        {story?.chats.map((chat, i) => (
          <ChatButton
            key={chat._id}
            story={story}
            chat={chat}
            index={i + 1}
            unlocked={unlockedStoryChapters.includes(chat._id)}
            completed={completedStoryChapters.includes(chat._id)}
          />
        ))}
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.euLogo}>
          <img src={`/eu/euposlogo_${lang}.png`} alt="" />
        </div>
      </div>
    </div>
  );
};
