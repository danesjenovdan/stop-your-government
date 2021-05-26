import React, { useEffect, useRef } from 'react';
import { useSpring } from 'react-spring';
import { useHistory } from 'react-router-dom';
import { Button } from './Button.jsx';
import styles from './Intro.module.scss';
import { getStoryLink } from '../utils/links.js';

export const Intro = () => {
  const history = useHistory();
  const scrollerRef = useRef();

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

  const width = 1280;
  const height = 3000;

  const ratio = (height / width) * 100;

  const onSelectClick = () => {
    const chatLink = getStoryLink('60866bc48da3c7319440cd2c');
    history.push(chatLink);
  };

  return (
    <div className={styles.introContainer} ref={scrollerRef}>
      <div className={styles.introHeight} style={{ paddingTop: `${ratio}%` }}>
        <div className={styles.intro}>
          <div className={styles.characters}>TODO: SHOW CHARACTERS</div>
          <div className={styles.buttons}>
            <Button
              variant="gold"
              className={styles.selectButton}
              onClick={onSelectClick}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
