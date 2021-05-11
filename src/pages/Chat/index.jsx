import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Story } from './story.jsx';
import styles from './style.module.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StoryList = () => (
  <>
    <p>Select story:</p>
    <ul>
      <li>
        <Link to="/chat?story=60866bc48da3c7319440cd2c">Demo story 1</Link>
      </li>
      <li>
        <Link to="/chat?story=someid2">Demo story 2</Link>
      </li>
    </ul>
  </>
);

export const Chat = () => {
  const query = useQuery();
  const storyId = query.get('story');

  return (
    <section className={styles.chat}>
      <h1>Chat</h1>
      {!storyId ? <StoryList /> : <Story id={storyId} />}
    </section>
  );
};
