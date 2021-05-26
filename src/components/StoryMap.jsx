import React, { useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Button } from './Button.jsx';
import { getChatLink } from '../utils/links.js';
import styles from './StoryMap.module.scss';
import government from '../assets/img/map/selected-government.png';
import home from '../assets/img/map/selected-home.png';
import mediaHouse from '../assets/img/map/selected-media-house.png';
import organization from '../assets/img/map/selected-organization.png';
import protectedLand from '../assets/img/map/selected-protected-land.png';
import scienceInstitute from '../assets/img/map/selected-science-institute.png';

const MAP_ICONS = [
  {
    key: 'government',
    chatId: '60ab894f8da3c73194005a41',
    image: government,
    width: '29%',
    top: '42.25%',
    left: '46%',
  },
  {
    key: 'home',
    chatId: '60866bc48da3c7319440cd30',
    image: home,
    width: '15%',
    top: '78%',
    left: '20%',
  },
  {
    key: 'media house',
    chatId: '60ab89408da3c73194005a3a',
    image: mediaHouse,
    width: '16.5%',
    top: '35%',
    left: '21.5%',
  },
  {
    key: 'organization',
    chatId: '60866f1a8da3c7319440f35d',
    image: organization,
    width: '20%',
    top: '67%',
    left: '55%',
  },
  {
    key: 'protected land',
    chatId: '60ab89fc8da3c73194005b06',
    image: protectedLand,
    width: '19.5%',
    top: '23%',
    left: '35.5%',
  },
  {
    key: 'science institute',
    chatId: '60ab87c48da3c7319400580c',
    image: scienceInstitute,
    width: '20.5%',
    top: '56%',
    left: '59%',
  },
];

const MapIcon = ({
  icon: { key, image, width, top, left } = {},
  selected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label={key}
      className={styles.icon}
      style={{ top, left, width }}
      onClick={onClick}
    >
      <img
        src={image}
        alt={key}
        className={classNames({ [styles.selected]: selected })}
      />
    </button>
  );
};

const Map = ({ selectedChatId, onIconClick }) => {
  const width = 1280;
  const height = 1821;

  const ratio = (height / width) * 100;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeight} style={{ paddingTop: `${ratio}%` }}>
        <div className={styles.map}>
          {MAP_ICONS.map((icon) => (
            <MapIcon
              key={icon.key}
              icon={icon}
              selected={icon.chatId === selectedChatId}
              onClick={() => onIconClick(icon.chatId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SelectedChatInfo = ({ index, title, description, onStartClick }) => {
  return (
    <div className={styles.selectedChatInfo}>
      <div className={styles.text}>
        <div className={styles.chapter}>Chapter {index + 1}</div>
        <div className={styles.name}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <Button variant="gold" className={styles.button} onClick={onStartClick}>
        Start
      </Button>
    </div>
  );
};

export const StoryMap = ({ story }) => {
  const history = useHistory();

  const [selectedChatId, setSelectedChatId] = useState(
    '60866bc48da3c7319440cd30'
  );
  const selectedChat = story.chats?.find((c) => c._id === selectedChatId);
  const selectedChatIndex = story.chats?.indexOf(selectedChat);

  const onIconClick = (chatId) => {
    setSelectedChatId(chatId);
  };

  const onStartClick = () => {
    const chatLink = getChatLink(story._id, selectedChatId);
    history.push(chatLink);
  };

  return (
    <>
      <Map selectedChatId={selectedChatId} onIconClick={onIconClick} />
      <SelectedChatInfo
        index={selectedChatIndex}
        title={selectedChat?.title}
        description={selectedChat?.description}
        onStartClick={onStartClick}
      />
    </>
  );
};
