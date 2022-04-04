import React, { useEffect } from 'react';
import { MESSAGE_DISPLAY, useMessageDisplay } from '../utils/chat-hooks.js';
import { useScrollToBottom } from '../utils/scroll-to-bottom.js';
import { ChatResponse } from './ChatResponse.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { TriggerChat } from './TriggerChat.jsx';
import { ReturnFromChat } from './ReturnFromChat.jsx';
import styles from './ChatMessage.module.scss';

function parseCustomCommand(text) {
  let commandText = (text || '').trim();
  if (!commandText.startsWith('#split')) {
    return {};
  }
  commandText = commandText.replace(/^#split/i, '').trim();
  const matches = commandText
    .split(/\n+/g)
    .map((command) => command.trim())
    .filter(Boolean)
    .map((command) => {
      let [input, result] = command.split('=').map((s) => s.trim());
      result = result.replace(/^"/, '').replace(/"$/, '');
      input = input
        .split('&')
        .map((s) => s.trim())
        .map((s) => {
          const [, key, op, value] = s.match(
            /([a-z_][a-z_ ]*)\s*([>=<])\s*([0-9a-z_-][0-9a-z_ ]*)/i
          );
          return [key.trim(), op, value.trim()];
        });
      return { input, result };
    });
  const storage = JSON.parse(localStorage.getItem('variables') || '{}');
  const validMatch = matches.find(({ input }) => {
    return input.every(([key, op, value]) => {
      const leftValue = storage[key] || 0;
      const rightValue = Number.isNaN(Number(value))
        ? storage[value] || 0
        : Number(value);
      if (op === '>') {
        return leftValue > rightValue;
      }
      if (op === '<') {
        return leftValue < rightValue;
      }
      return false;
    });
  });
  if (validMatch) {
    return { action: 'THREAD_CHANGE', threadName: validMatch.result };
  }
  return {};
}

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

export const ChatMessage = ({
  message,
  actor,
  triggerChat,
  story,
  threadId,
  pump,
}) => {
  const displayState = useMessageDisplay(message);
  const { maybeScrollToBottom } = useScrollToBottom();

  const messageType = message.text?.trim().startsWith('#')
    ? 'CUSTOM_COMMAND'
    : message.type;

  useEffect(() => {
    if (
      messageType === 'ACTION_MAIN_THREAD_BACK' ||
      messageType === 'ACTION_THREAD_BACK'
    ) {
      pump({ action: 'THREAD_BACK' });
    }
    if (messageType === 'CUSTOM_COMMAND') {
      const { action, threadName } = parseCustomCommand(message.text);
      if (action === 'THREAD_CHANGE' && threadName) {
        pump({ action, threadName });
      }
    }
  }, []);

  useEffect(() => {
    maybeScrollToBottom();
  }, [displayState]);

  if (displayState === MESSAGE_DISPLAY.WAITING) {
    return null;
  }

  if (
    messageType === 'ACTION_MAIN_THREAD_BACK' ||
    messageType === 'ACTION_THREAD_BACK' ||
    messageType === 'CUSTOM_COMMAND'
  ) {
    return null;
  }

  let content;
  if (displayState === MESSAGE_DISPLAY.WRITING) {
    content = <Content actor={actor} text={<TypingIndicator />} />;
  } else if (messageType === 'TEXT') {
    content = message.text?.length ? (
      <Content actor={actor} text={message.text} />
    ) : null;
  } else if (messageType === 'IMAGE') {
    content = message.file?.url ? (
      <Content actor={actor} image={message.file} />
    ) : null;
  } else if (messageType === 'ACTION' && triggerChat) {
    content = <TriggerChat story={story} chat={triggerChat} />;
  } else if (messageType === 'ACTION_QUEST_END') {
    content = <ReturnFromChat story={story} chat={triggerChat} />;
  } else {
    content = <div>Unknown message type: {messageType}</div>;
  }

  return (
    <>
      {!!content && (
        <div className={styles.message}>
          <Avatar actor={actor} />
          {content}
        </div>
      )}
      {displayState === MESSAGE_DISPLAY.SHOWN && (
        <ChatResponse
          key={message.response._id}
          response={message.response}
          threadId={threadId}
          pump={pump}
        />
      )}
    </>
  );
};
