import React, { useEffect } from 'react';
import classNames from 'classnames';
import { MESSAGE_DISPLAY, useMessageDisplay } from '../utils/chat-hooks.js';
import { useScrollToBottom } from '../utils/scroll-to-bottom.js';
import { getStoredVariables } from '../utils/variables.js';
import { ChatResponse, updateVariables } from './ChatResponse.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { TriggerChat } from './TriggerChat.jsx';
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
      const commandParts = command.split(' = ').map((s) => s.trim());
      if (commandParts?.length !== 2) {
        // eslint-disable-next-line no-alert
        alert(
          `Invalid #split command!\n(only one ' = ' allowed, must have spaces around):\n\n${command}`
        );
        return null;
      }
      let [input, result] = commandParts;
      result = result.replace(/^["“”]/, '').replace(/["“”]$/, '');
      input = input
        .split('&')
        .map((s) => s.trim())
        .map((s) => {
          const comparisonParts = s.split(/[>=<]{1,2}/i);
          if (comparisonParts?.length !== 2) {
            // eslint-disable-next-line no-alert
            alert(
              `Invalid #split command!\n(only one comparison at a time is allowed, separated with '&')\n\n${s}`
            );
            return null;
          }
          const match = s.match(
            /([a-z_][a-z_ ]*)\s*([>=<]{1,2})\s*([0-9a-z_-][0-9a-z_ ]*)/i
          );
          const [, key, op, value] = match;
          return [key.trim(), op, value.trim()];
        })
        .filter(Boolean);
      return { input, result };
    })
    .filter(Boolean);
  const variables = getStoredVariables();
  const validMatch = matches.find(({ input }) => {
    return input.every(([key, op, value]) => {
      const leftValue = variables[key] || 0;
      const rightValue = Number.isNaN(Number(value))
        ? variables[value] || 0
        : Number(value);
      if (op === '>') {
        return leftValue > rightValue;
      }
      if (op === '>=') {
        return leftValue >= rightValue;
      }
      if (op === '<') {
        return leftValue < rightValue;
      }
      if (op === '<=') {
        return leftValue <= rightValue;
      }
      if (op === '==') {
        return leftValue === rightValue;
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
      <div
        className={classNames(styles.bubble, {
          [styles.narrator]: !actor?.name,
        })}
      >
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
  chat,
  threadId,
  pump,
}) => {
  const displayState = useMessageDisplay(message);
  const { maybeScrollToBottom } = useScrollToBottom();

  const messageType =
    message.text?.trim().startsWith('#') &&
    !message.text?.trim().startsWith('#\ufe0f')
      ? 'CUSTOM_COMMAND'
      : message.type;

  const { action, threadName } = parseCustomCommand(message.text);

  useEffect(() => {
    if (messageType === 'CUSTOM_COMMAND' && action && threadName) {
      // eslint-disable-next-line no-console
      console.log(message.text);
    }

    if (messageType === 'ACTION_MAIN_THREAD_BACK') {
      pump({ action: 'THREAD_BACK_TO_MAIN' });
    }
    if (messageType === 'ACTION_THREAD_BACK') {
      pump({ action: 'THREAD_BACK' });
    }
    if (messageType === 'CUSTOM_COMMAND') {
      updateVariables(message.text);
      if (action === 'THREAD_CHANGE' && threadName) {
        pump({ action, threadName });
      } else if (
        message.response.type === 'CONFIRMATION' &&
        message.response.confirmText === 'Continue'
      ) {
        pump();
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
    messageType === 'ACTION_THREAD_BACK'
  ) {
    return null;
  }

  if (messageType === 'CUSTOM_COMMAND') {
    if (action === 'THREAD_CHANGE' && threadName) {
      return null;
    }
    if (
      message.response.type === 'CONFIRMATION' &&
      message.response.confirmText === 'Continue'
    ) {
      return null;
    }
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
    content = (
      <TriggerChat story={story} chat={chat} triggerChat={triggerChat} />
    );
  } else if (messageType === 'ACTION_QUEST_END') {
    content = null;
  } else if (messageType === 'CUSTOM_COMMAND') {
    content = null;
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
