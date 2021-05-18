import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { RESPONSE_DISPLAY, useResponseDisplay } from './chat/hooks.js';
import msgStyles from './ChatMessage.module.scss';
import styles from './ChatResponse.module.scss';

export const ChatResponse = ({ response, pump }) => {
  const [displayState, setResponded] = useResponseDisplay(response);
  const [messageText, setMessageText] = useState(response.confirmText);

  useEffect(() => {
    if (response.type === 'NO_RESPONSE') {
      pump();
    }
  }, []);

  if (displayState === RESPONSE_DISPLAY.HIDDEN) {
    return null;
  }

  if (displayState === RESPONSE_DISPLAY.MESSAGE) {
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
    ({ isCorrect }) =>
    () => {
      if (isCorrect) {
        setResponded();
        pump();
      }
    };

  const respondToOptions =
    ({ text, thread }) =>
    () => {
      setMessageText(text);
      setResponded();
      pump({ action: 'THREAD_CHANGE', threadId: thread });
    };

  let content;
  if (response.type === 'CONFIRMATION') {
    content = (
      <div className={styles.confirmation}>
        <button type="button" className={styles.button} onClick={respond}>
          {response.confirmText}
        </button>
      </div>
    );
  } else if (response.type === 'QUIZ') {
    content = (
      <>
        {response.options?.map((option) => {
          return (
            <button
              key={option._id}
              type="button"
              onClick={respondToQuiz(option)}
            >
              {option.buttonText}
            </button>
          );
        })}
      </>
    );
  } else if (response.type === 'OPTIONS') {
    content = (
      <>
        {response.options?.map((option) => {
          return (
            <button
              key={option._id}
              type="button"
              onClick={respondToOptions(option)}
            >
              {option.buttonText}
            </button>
          );
        })}
      </>
    );
  } else {
    content = <div>Unknown response type: {response.type}</div>;
  }

  return <>{!!content && <div className={styles.response}>{content}</div>}</>;
};
