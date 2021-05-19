import React, { useEffect } from 'react';
import { MESSAGE_DISPLAY, useMessageDisplay } from '../utils/chat-hooks.js';
import { useScrollToBottom } from '../utils/scroll-to-bottom.js';
import { ChatResponse } from './ChatResponse.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { TriggerChat } from './TriggerChat.jsx';
import styles from './ChatMessage.module.scss';

const Avatar = ({ actor }) => {
  if (!actor?.avatar?.url) {
    return null;
  }
  return (
    <div
      className={styles.avatar}
      style={{ backgroundImage: `url("${actor.avatar.url}")` }}
    />
  );
};

const Content = ({ actor, text, image }) => {
  return (
    <div className={styles.content}>
      {!!actor?.name && <div className={styles.name}>{actor.name}</div>}
      <div className={styles.bubble}>
        {!!image && <ImageWithPreview image={image} className={styles.image} />}
        {!!text && <div className={styles.text}>{text}</div>}
      </div>
    </div>
  );
};

export const ChatMessage = ({ message, actor, triggerChat, pump }) => {
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

  let content;
  if (displayState === MESSAGE_DISPLAY.WRITING) {
    content = <Content actor={actor} text={<TypingIndicator />} />;
  } else if (message.type === 'TEXT') {
    content = message.text?.length ? (
      <Content actor={actor} text={message.text} />
    ) : null;
  } else if (message.type === 'IMAGE') {
    content = message.file?.url ? (
      <Content actor={actor} image={message.file} />
    ) : null;
  } else if (message.type === 'ACTION_MAIN_THREAD_BACK') {
    content = null;
  } else if (message.type === 'ACTION' && triggerChat) {
    content = <TriggerChat chat={triggerChat} />;
  } else {
    content = <div>Unknown message type: {message.type}</div>;
  }

  // TODO: dont show response if message is still writing
  return (
    <>
      {!!content && (
        <div className={styles.message}>
          <Avatar actor={actor} />
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
