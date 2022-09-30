import React, { useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Button } from './Button.jsx';
import styles from './Intro.module.scss';
import { getStoryLink } from '../utils/links.js';
import {
  CHARACTERS,
  CHARACTERS_HRV,
  CHARACTERS_SRP,
} from '../utils/character-stories.js';

const characters = {
  slv: CHARACTERS,
  hrv: CHARACTERS_HRV,
  srp: CHARACTERS_SRP,
};

export const Intro = ({ lang }) => {
  const history = useHistory();
  const scrollerRef = useRef();
  const CHARS = characters[lang];
  const [selectedCharacter, setSelectedCharacter] = useState(CHARS[0]);

  const currentCharacterIndex = CHARS.indexOf(selectedCharacter);
  const getNextCharacterIndex =
    (dir = 1) =>
    () => {
      return (currentCharacterIndex + dir + CHARS.length) % CHARS.length;
    };

  const [, springScroll] = useSpring(() => ({
    y: 0,
    onChange: ({ value }) => {
      scrollerRef.current.scrollTo(0, value.y);
    },
    config: {
      duration: 1500,
      easing: (t) => (1 - Math.cos(Math.PI * t)) / 2,
    },
  }));

  useEffect(() => {
    setTimeout(() => {
      const scroller = scrollerRef.current;
      const scroll = scroller.scrollHeight - scroller.clientHeight;
      springScroll.start({ y: scroll });
    }, 1500);
  }, []);

  const width = 2560;
  const height = 6146;

  const ratio = (height / width) * 100;

  const onSelectClick = () => {
    const chatLink = getStoryLink(selectedCharacter.storyId, lang);
    history.push(chatLink);
  };

  const selectNextCharacter =
    (dir = 1) =>
    () => {
      setSelectedCharacter(CHARS[getNextCharacterIndex(dir)()]);
    };

  return (
    <div className={styles.introContainer} ref={scrollerRef}>
      <div className={styles.introHeight} style={{ paddingTop: `${ratio}%` }}>
        <div className={styles.intro}>
          <div className={styles.characters}>
            {((character) => (
              <div className={styles.character}>
                <img
                  key={character.name}
                  style={{ width: '100%' }}
                  src={character.image}
                  alt={character.name}
                />
              </div>
            ))(CHARS[getNextCharacterIndex(-1)()])}
            <div className={classNames(styles.character, styles.selected)}>
              <img
                key={selectedCharacter.name}
                style={{ width: '100%' }}
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
              />
            </div>
            {((character) => (
              <div className={styles.character}>
                <img
                  key={character.name}
                  style={{ width: '100%' }}
                  src={character.image}
                  alt={character.name}
                />
              </div>
            ))(CHARS[getNextCharacterIndex(1)()])}
          </div>
          <div className={styles.buttons}>
            <div className={styles.character}>
              <Button
                className={styles.arrow}
                onClick={selectNextCharacter(-1)}
              >
                <svg viewBox="0 0 88 90" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M1.75731 40.7574C-0.585838 43.1005 -0.585838 46.8995 1.75731 49.2426L39.9411 87.4264C42.2842 89.7696 46.0832 89.7696 48.4264 87.4264C50.7695 85.0833 50.7695 81.2843 48.4264 78.9411L14.4852 45L48.4264 11.0589C50.7695 8.71573 50.7695 4.91674 48.4263 2.5736C46.0832 0.230449 42.2842 0.23045 39.9411 2.5736L1.75731 40.7574ZM87.0493 39L5.99995 39L5.99995 51L87.0493 51L87.0493 39Z"
                  />
                </svg>
              </Button>
              <div className={styles.selectedName}>
                <div>{selectedCharacter.name}</div>
                <div className={styles.theme}>{selectedCharacter.theme}</div>
              </div>
              <Button className={styles.arrow} onClick={selectNextCharacter(1)}>
                <svg viewBox="0 0 88 90" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M85.292 49.2426C87.6352 46.8995 87.6352 43.1005 85.292 40.7574L47.1082 2.57359C44.7651 0.230446 40.9661 0.230446 38.623 2.57359C36.2798 4.91674 36.2798 8.71573 38.623 11.0589L72.5641 45L38.623 78.9411C36.2798 81.2843 36.2798 85.0833 38.623 87.4264C40.9661 89.7696 44.7651 89.7696 47.1082 87.4264L85.292 49.2426ZM0 51H81.0494V39H0L0 51Z"
                  />
                </svg>
              </Button>
            </div>
            <Button
              variant="gold"
              className={styles.selectButton}
              onClick={onSelectClick}
            >
              IZBERI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
