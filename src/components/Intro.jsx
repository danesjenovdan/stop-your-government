import React from 'react';
// import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import classNames from 'classnames';
import { Button } from './Button.jsx';
import styles from './Intro.module.scss';
import { getStoryLink } from '../utils/links.js';
import {
  deleteStoredVariables,
  deleteUnlockedChapters,
} from '../utils/variables.js';
// import {
//   CHARACTERS,
//   CHARACTERS_HRV,
//   CHARACTERS_SRP,
// } from '../utils/character-stories.js';

// const characters = {
//   slv: CHARACTERS,
//   hrv: CHARACTERS_HRV,
//   srp: CHARACTERS_SRP,
// };

// const selectText = {
//   slv: 'IZBERI',
//   hrv: 'ODABERI',
//   srp: 'IZABERI',
// };

// const titleText = {
//   slv: 'Izberi zgodbo',
//   hrv: 'Odaberite priču',
//   srp: 'Izaberite priču',
// };

export const Intro = ({ lang }) => {
  const history = useHistory();
  // const CHARS = characters[lang];
  // const SELECT_TEXT = selectText[lang];
  const SELECT_TEXT = 'Začni';
  // const TITLE_TEXT = titleText[lang];
  // const [selectedCharacter, setSelectedCharacter] = useState(CHARS[0]);

  // const currentCharacterIndex = CHARS.indexOf(selectedCharacter);
  // const getNextCharacterIndex =
  //   (dir = 1) =>
  //   () => {
  //     return (currentCharacterIndex + dir + CHARS.length) % CHARS.length;
  //   };

  const width = 2560;
  const height = 3642;

  const ratio = (height / width) * 100;

  const onSelectClick = () => {
    deleteStoredVariables();
    deleteUnlockedChapters();
    // const chatLink = getStoryLink(selectedCharacter.storyId, lang);
    const chatLink = getStoryLink('6548aea711622f51d8869475', lang);
    history.push(chatLink);
  };

  // const selectNextCharacter =
  //   (dir = 1) =>
  //   () => {
  //     setSelectedCharacter(CHARS[getNextCharacterIndex(dir)()]);
  //   };

  return (
    <div className={styles.introContainer}>
      <div className={styles.introHeight} style={{ paddingTop: `${ratio}%` }}>
        <div className={styles.intro}>
          <div className={styles.charactersWrapper}>
            {/* <div className={styles.characters}>
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
            </div> */}
          </div>
          <div className={styles.buttons}>
            {/* <div className={styles.title}>{TITLE_TEXT}</div> */}
            {/* <div className={styles.character}>
              <Button
                className={styles.arrow}
                onClick={selectNextCharacter(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1179.95 667.49"
                >
                  <path
                    fill="currentColor"
                    d="M1147.16 97.87c24.07 125.07 19.36 278.85 32.54 414.82-195.66 31.24-427.06-38.07-618.21-65.09.36 67.97 26.13 167.61-8.14 219.64C355.78 558.48 164.41 443.39.25 301.22 151.78 176.18 314.13 61.93 528.97.25h.01c21.35 74.45 24.34 129.17 24.38 203.33 208.45-24.71 372.52-93.81 593.8-105.71Z"
                  />
                </svg>
              </Button>
              <div className={styles.selectedName}>
                <div>{selectedCharacter.name}</div>
                <div className={styles.theme}>{selectedCharacter.theme}</div>
              </div>
              <Button className={styles.arrow} onClick={selectNextCharacter(1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1179.95 667.49"
                >
                  <path
                    fill="currentColor"
                    d="M32.79 569.62C8.72 444.55 13.43 290.77.25 154.8c195.66-31.24 427.06 38.07 618.21 65.09-.36-67.97-26.13-167.61 8.14-219.64 197.57 108.76 388.94 223.85 553.1 366.02-151.53 125.04-313.88 239.29-528.72 300.97h-.01c-21.35-74.45-24.34-129.17-24.38-203.33-208.45 24.71-372.52 93.81-593.8 105.71Z"
                  />
                </svg>
              </Button>
            </div> */}
            <Button
              variant="gold"
              className={styles.selectButton}
              onClick={onSelectClick}
            >
              {SELECT_TEXT}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
