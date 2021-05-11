import React, { useEffect } from 'react';
import { MESSAGE_DISPLAY, useMessageDisplay } from './chat/hooks.js';
import styles from './ChatMessage.module.scss';

export const ChatMessage = ({ message, actor, pump }) => {
  const displayState = useMessageDisplay(message);

  useEffect(() => {
    if (message.type === 'ACTION_MAIN_THREAD_BACK') {
      pump({ action: 'THREAD_BACK' });
    }
  }, []);

  if (displayState === MESSAGE_DISPLAY.WAITING) {
    return null;
  }

  if (displayState === MESSAGE_DISPLAY.WRITING) {
    return <div>...</div>;
  }

  const avatar = actor?.avatar?.url ? (
    <div
      className={styles.avatar}
      style={{ backgroundImage: `url("${actor.avatar.url}")` }}
    />
  ) : null;
  const name = actor?.name ? (
    <div className={styles.name}>{actor.name}</div>
  ) : null;

  let content = <div>Unknown message type: {message.type}</div>;

  if (message.type === 'TEXT') {
    content = message.text?.length ? (
      <div className={styles.content}>
        {name}
        <div className={styles.bubble}>{message.text}</div>
      </div>
    ) : null;
  } else if (message.type === 'IMAGE') {
    content = (
      <div className={styles.content}>
        {name}
        <div className={styles.bubble}>
          <img className={styles.image} src={message.file.url} alt="" />
        </div>
      </div>
    );
  } else if (message.type === 'ACTION_MAIN_THREAD_BACK') {
    content = null;
  }

  return (
    <>
      {!!content && (
        <div className={styles.message}>
          {avatar}
          {content}
        </div>
      )}
      {/* <Response
        key={message.response._id}
        response={message.response}
        pump={pump}
      /> */}
    </>
  );
};
