import React from 'react';
import { useHistory } from 'react-router-dom';
import { getStoryLink } from '../utils/links.js';
import { Button } from './Button.jsx';
import styles from './ReturnFromChat.module.scss';

export const ReturnFromChat = ({ story, chat }) => {
  const history = useHistory();

  const onClick = () => {
    return history.push(getStoryLink(story._id));
  };

  // TODO: highlight chat on return
  return (
    <div className={styles.returnFromChat}>
      <Button onClick={onClick}>Return to map</Button>
    </div>
  );
};
