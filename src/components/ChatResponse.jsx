import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { RESPONSE_DISPLAY, useResponseDisplay } from '../utils/chat-hooks.js';
import { useScrollToBottom } from '../utils/scroll-to-bottom.js';
import { Button } from './Button.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import msgStyles from './ChatMessage.module.scss';
import styles from './ChatResponse.module.scss';
import { getStoredVariables, setStoredVariables } from '../utils/variables.js';

export function updateVariables(text) {
  let commandText = (text || '').trim();
  if (!commandText.startsWith('#variable')) {
    return;
  }
  commandText = commandText.replace(/^#variable/i, '').trim();
  const matches = [
    ...commandText.matchAll(/([a-z_][a-z_ ]*?)\s*([+-])\s*(\d+)/gi),
  ];
  const variables = getStoredVariables();
  matches.forEach(([, key, operation, number]) => {
    let value = variables[key] || 0;
    if (operation === '+') {
      value += Number(number);
    } else if (operation === '-') {
      value -= Number(number);
    }
    variables[key] = value;
  });
  setStoredVariables(variables);
}

export const ChatResponse = ({ response, threadId, pump }) => {
  const [displayState, setResponded] = useResponseDisplay(response);
  const [messageText, setMessageText] = useState(response.confirmText);
  const { maybeScrollToBottom } = useScrollToBottom();

  const [markedWrongOptions, setMarkedWrongOptions] = useState(new Set());

  useEffect(() => {
    if (response.type === 'NO_RESPONSE') {
      pump();
    }
  }, []);

  useEffect(() => {
    maybeScrollToBottom();
  }, [displayState]);

  if (displayState === RESPONSE_DISPLAY.HIDDEN) {
    return null;
  }

  if (displayState === RESPONSE_DISPLAY.MESSAGE) {
    // TODO: use message content component
    return (
      <div className={classNames(msgStyles.message, msgStyles.mine)}>
        <div className={msgStyles.content}>
          <div className={msgStyles.bubble}>
            <div className={msgStyles.text}>{messageText}</div>
          </div>
        </div>
      </div>
    );
  }

  const respond = () => {
    setResponded();
    pump();
  };

  const respondToQuiz =
    ({ _id, isCorrect, text, buttonText }) =>
    () => {
      // TODO: style buttons on wrong selection
      if (isCorrect) {
        const overrideMessageText = text || buttonText;
        if (overrideMessageText) {
          setMessageText(buttonText);
        }
        setMarkedWrongOptions(new Set());
        setResponded();
        pump();
      } else {
        setMarkedWrongOptions((prev) => new Set([...prev, _id]));
      }
    };

  const respondToOptions =
    ({ thread, text, buttonText }) =>
    () => {
      updateVariables(text);
      const overrideMessageText = text || buttonText;
      if (overrideMessageText) {
        setMessageText(buttonText);
      }
      setResponded();
      if (threadId !== thread) {
        pump({ action: 'THREAD_CHANGE', threadId: thread });
      } else {
        pump();
      }
    };

  let content;
  if (response.type === 'CONFIRMATION') {
    content = (
      <div className={styles.confirmation}>
        <Button onClick={respond}>{response.confirmText}</Button>
      </div>
    );
  } else if (response.type === 'QUIZ') {
    content = (
      <div className={styles.quiz}>
        <div className={styles.text}>{response.confirmText}</div>
        <div className={styles.buttons}>
          {response.options?.map((option) => (
            <Button
              key={option._id}
              className={classNames({
                [styles.button]: true,
                [styles.incorrect]: markedWrongOptions.has(option._id),
              })}
              onClick={respondToQuiz(option)}
            >
              {option.buttonText}
            </Button>
          ))}
        </div>
      </div>
    );
  } else if (response.type === 'PHOTO_QUIZ') {
    content = (
      <div className={styles.quiz}>
        <div className={styles.text}>{response.confirmText}</div>
        <div className={classNames(styles.buttons, styles.images)}>
          {response.photoOptions?.map((option) => (
            <ImageWithPreview
              key={option._id}
              image={option.photo}
              className={classNames({
                [styles.image]: true,
                [styles.incorrect]: markedWrongOptions.has(option._id),
              })}
              style={{ width: '100%' }}
              onClick={respondToQuiz(option)}
            />
          ))}
        </div>
      </div>
    );
  } else if (response.type === 'OPTIONS') {
    content = (
      <div className={styles.options}>
        <div className={styles.buttons}>
          {response.options?.map((option) => (
            <Button
              key={option._id}
              className={styles.button}
              onClick={respondToOptions(option)}
            >
              {option.buttonText}
            </Button>
          ))}
        </div>
      </div>
    );
  } else if (response.type === 'SLIDING_PUZZLE') {
    content = (
      <div className={styles.quiz}>
        <div className={styles.text}>
          {response.confirmText} (NOT IMPLEMENTED CLICK IMAGE TO CONTINUE)
        </div>
        <div className={styles.slidingPuzzle}>
          <ImageWithPreview
            image={response.photo}
            // TODO: implement sliding puzzle
            // className={styles.image}
            style={{ width: '100%' }}
            onClick={respond}
          />
        </div>
      </div>
    );
  } else {
    content = <div>Unknown response type: {response.type}</div>;
  }

  return <>{!!content && <div className={styles.response}>{content}</div>}</>;
};
