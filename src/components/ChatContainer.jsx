import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../utils/hooks.js';
import { Button } from './Button.jsx';
import { ChatMessages } from './ChatMessages.jsx';
// import stopSign from '../assets/img/stop-sign-pole-bird.png';
import styles from './ChatContainer.module.scss';
import { getStoryLink } from '../utils/links.js';

export const ChatContainer = ({ story, /* character, */ chat }) => {
  const history = useHistory();
  const query = useQuery();
  const lang = query.get('lang');

  const onBackClick = () => {
    return history.push(getStoryLink(story._id, lang));
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <Button className={styles.backButton} onClick={onBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="168.94 151.45 419.3 449.9"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M209.03 151.66c62.33-5.4 56.06 92.94 2.65 93.33-47.46.35-64.74-87.95-2.65-93.33zm379.21 39.59c-11.1 33.3-56.86 16.26-90.17 16.97-55.51 1.2-125.75 6.67-169.7-8.49-.98-14.37 7.93-18.43 18.55-19.8 28.79-3.69 79.17 0 127.3 0 45.01.01 94.57-7.27 114.02 11.32zM209.03 324.18c62.33-5.4 56.06 92.94 2.65 93.33-47.46.35-64.74-87.96-2.65-93.33zm379.21 39.6c-11.1 33.3-56.86 16.25-90.17 16.97-55.51 1.19-125.75 6.67-169.7-8.48-.98-14.39 7.93-18.44 18.55-19.8 28.79-3.69 79.17 0 127.3 0 45.01 0 94.57-7.29 114.02 11.3zM209.03 508.01c62.33-5.38 56.06 92.96 2.65 93.34-47.46.34-64.74-87.96-2.65-93.34zm379.21 39.61c-11.1 33.29-56.86 16.26-90.17 16.96-55.51 1.18-125.75 6.68-169.7-8.48-.98-14.4 7.93-18.43 18.55-19.8 28.79-3.7 79.17 0 127.3 0 45.01 0 94.57-7.27 114.02 11.32z"
              />
            </svg>
          </Button>
          <div className={styles.character}>
            <div className={styles.name}>
              {/* <div>{character.name}</div> */}
              <div className={styles.theme}>{chat.title}</div>
            </div>
          </div>
          {/* <div className={styles.image}>
            <img src={stopSign} alt="" />
          </div> */}
        </div>
      </div>
      <ChatMessages story={story} chat={chat} />
    </>
  );
};
