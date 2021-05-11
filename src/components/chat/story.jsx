import React, { useEffect, useState } from 'react';
import { RESPONSE_DISPLAY, useResponseDisplay } from './hooks.js';

const styles = {};

export const Response = ({ response, pump }) => {
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
      <div className={[styles.message, styles.mine].join(' ')}>
        <p className={styles.bubble}>{messageText}</p>
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

  if (response.type === 'CONFIRMATION') {
    return (
      <button type="button" onClick={respond}>
        {response.confirmText}
      </button>
    );
  }
  if (response.type === 'QUIZ') {
    return (
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
  }
  if (response.type === 'OPTIONS') {
    return (
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
  }

  return <p>Unknown response type: {response.type}</p>;
};
