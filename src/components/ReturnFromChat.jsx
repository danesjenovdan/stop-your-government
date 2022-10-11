import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../utils/hooks.js';
import { getStoryLink } from '../utils/links.js';
import { Button } from './Button.jsx';
import styles from './ReturnFromChat.module.scss';

export const ReturnFromChat = ({ story }) => {
  const history = useHistory();
  const query = useQuery();
  const lang = query.get('lang');

  const onClick = () => {
    return history.push(getStoryLink(story._id, lang));
  };

  return (
    <div className={styles.returnFromChat}>
      <Button onClick={onClick}>Return to map</Button>
    </div>
  );
};
