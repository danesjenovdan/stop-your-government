import React, { useEffect, useState } from "react";
import {
  MESSAGE_DISPLAY,
  RESPONSE_DISPLAY,
  useMessageDisplay,
  useResponseDisplay,
  useStoryJson,
} from "./hooks.js";
import styles from "./style.module.css";

const MessageResponse = ({ response, pump }) => {
  const [displayState, setResponded] = useResponseDisplay(response);

  useEffect(() => {
    if (response.type === "NO_RESPONSE") {
      pump();
    }
  }, []);

  if (displayState === RESPONSE_DISPLAY.HIDDEN) {
    return null;
  }

  if (displayState === RESPONSE_DISPLAY.MESSAGE) {
    return (
      <div className={[styles.message, styles.mine].join(" ")}>
        <p className={styles.bubble}>{response.confirmText}</p>
      </div>
    );
  }

  const respond = () => {
    setResponded();
    pump();
  };

  const respondQuiz = ({ isCorrect }) => () => {
    if (isCorrect) {
      setResponded();
      pump();
    }
  };

  if (response.type === "CONFIRMATION") {
    return (
      <button type="button" onClick={respond}>
        {response.confirmText}
      </button>
    );
  }
  if (response.type === "QUIZ") {
    return (
      <>
        {response.options?.map((option) => {
          return (
            <button
              key={option._id}
              type="button"
              onClick={respondQuiz(option)}
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

const Message = ({ message, actor, pump }) => {
  const displayState = useMessageDisplay(message);

  if (displayState === MESSAGE_DISPLAY.WAITING) {
    return null;
  }

  if (displayState === MESSAGE_DISPLAY.WRITING) {
    return <p>...</p>;
  }

  let content = <p>Unknown message type: {message.type}</p>;

  if (message.type === "TEXT") {
    content = message.text?.length ? (
      <p className={styles.bubble}>{message.text}</p>
    ) : null;
  } else if (message.type === "IMAGE") {
    content = (
      <p className={styles.bubble}>
        <img className={styles.image} src={message.file.thumbUrl} alt="" />
      </p>
    );
  }

  return (
    <>
      {!!content && (
        <div className={styles.message}>
          {!!actor && (
            <img
              className={styles.avatar}
              src={actor.avatar.thumbUrl}
              alt={actor.name}
            />
          )}
          {content}
        </div>
      )}
      <MessageResponse
        key={message.response._id}
        response={message.response}
        pump={pump}
      />
    </>
  );
};

const MessageThread = ({ story }) => {
  const initialChat = story?.chats.find((chat) => chat.isMainChat);
  const [currentChat] = useState(initialChat);

  const initialThread = currentChat?.threads?.[0];
  const [currentThread] = useState(initialThread);

  const initialMessage = currentThread?.messages?.[0];
  const [messages, setMessages] = useState(
    initialMessage ? [initialMessage] : []
  );

  const pump = () => {
    const last = messages[messages.length - 1];
    const i = currentThread.messages.findIndex((msg) => msg._id === last._id);
    const nextMessage = currentThread.messages[i + 1];
    if (nextMessage) {
      setMessages((prevMessages) => [...prevMessages, nextMessage]);
    }
  };

  console.log(messages);

  return (
    <>
      <hr />
      {messages?.map((message) => {
        const actor = story.actors.find((a) => a._id === message.actor);
        return (
          <Message
            key={message._id}
            message={message}
            actor={actor}
            pump={pump}
          />
        );
      })}
    </>
  );
};

export const Story = ({ id }) => {
  const { loading, error, data: story } = useStoryJson(id);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (error || !story) {
    return <h3>Error: {error?.message}</h3>;
  }

  return (
    <>
      <h3>{story.name}</h3>
      <MessageThread story={story} />
    </>
  );
};
