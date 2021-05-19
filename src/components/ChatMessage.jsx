import React, { useEffect } from 'react';
import { MESSAGE_DISPLAY, useMessageDisplay } from '../utils/chat-hooks.js';
import { useScrollToBottom } from '../utils/scroll-to-bottom.js';
import { ChatResponse } from './ChatResponse.jsx';
import styles from './ChatMessage.module.scss';

export const ChatMessage = ({ message, actor, pump }) => {
  const displayState = useMessageDisplay(message);
  const { maybeScrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (message.type === 'ACTION_MAIN_THREAD_BACK') {
      pump({ action: 'THREAD_BACK' });
    }
  }, []);

  useEffect(() => {
    maybeScrollToBottom();
  }, [displayState]);

  if (displayState === MESSAGE_DISPLAY.WAITING) {
    return null;
  }

  if (displayState === MESSAGE_DISPLAY.WRITING) {
    return <div>...</div>; // TODO: style writing dots/bubbles
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

  let content;
  if (message.type === 'TEXT') {
    content = message.text?.length ? (
      <div className={styles.content}>
        {name}
        <div className={styles.bubble}>
          <div className={styles.text}>{message.text}</div>
        </div>
      </div>
    ) : null;
  } else if (message.type === 'IMAGE') {
    content = message.file?.url ? (
      <div className={styles.content}>
        {name}
        <div className={styles.bubble}>
          <img className={styles.image} src={message.file.url} alt="" />
        </div>
      </div>
    ) : null;
  } else if (message.type === 'ACTION_MAIN_THREAD_BACK') {
    content = null;
  } else {
    content = <div>Unknown message type: {message.type}</div>;
  }

  return (
    <>
      {!!content && (
        <div className={styles.message}>
          {avatar}
          {content}
        </div>
      )}
      <ChatResponse
        key={message.response._id}
        response={message.response}
        pump={pump}
      />
    </>
  );
};
