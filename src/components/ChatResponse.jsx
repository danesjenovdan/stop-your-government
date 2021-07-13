import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { RESPONSE_DISPLAY, useResponseDisplay } from '../utils/chat-hooks.js';
import { useScrollToBottom } from '../utils/scroll-to-bottom.js';
import { Button } from './Button.jsx';
import { ImageWithPreview } from './ImageWithPreview.jsx';
import msgStyles from './ChatMessage.module.scss';
import styles from './ChatResponse.module.scss';

export const ChatResponse = ({ response, pump }) => {
  const [displayState, setResponded] = useResponseDisplay(response);
  const [messageText, setMessageText] = useState(response.confirmText);
  const { maybeScrollToBottom } = useScrollToBottom();

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
    ({ isCorrect, text, buttonText }) =>
    () => {
      // TODO: style buttons on wrong selection
      if (isCorrect) {
        const overrideMessageText = text || buttonText;
        if (overrideMessageText) {
          setMessageText(buttonText);
        }
        setResponded();
        pump();
      }
    };

  const respondToOptions =
    ({ thread, text, buttonText }) =>
    () => {
      const overrideMessageText = text || buttonText;
      if (overrideMessageText) {
        setMessageText(buttonText);
      }
      setResponded();
      pump({ action: 'THREAD_CHANGE', threadId: thread });
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
              className={styles.button}
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
              className={styles.image}
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
  } else {
    content = <div>Unknown response type: {response.type}</div>;
  }

  return <>{!!content && <div className={styles.response}>{content}</div>}</>;
};
