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
  const [messageText, setMessageText] = useState(response.confirmText);

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
        <p className={styles.bubble}>{messageText}</p>
      </div>
    );
  }

  const respond = () => {
    setResponded();
    pump();
  };

  const respondToQuiz = ({ isCorrect }) => () => {
    if (isCorrect) {
      setResponded();
      pump();
    }
  };

  const respondToOptions = ({ text, thread }) => () => {
    setMessageText(text);
    setResponded();
    pump({ action: "THREAD_CHANGE", threadId: thread });
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
              onClick={respondToQuiz(option)}
            >
              {option.buttonText}
            </button>
          );
        })}
      </>
    );
  }
  if (response.type === "OPTIONS") {
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

const Message = ({ message, actor, pump }) => {
  const displayState = useMessageDisplay(message);

  useEffect(() => {
    if (message.type === "ACTION_MAIN_THREAD_BACK") {
      pump({ action: "THREAD_BACK" });
    }
  }, []);

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
  } else if (message.type === "ACTION_MAIN_THREAD_BACK") {
    content = null;
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
  const [threads, setThreads] = useState(initialThread ? [initialThread] : []);
  const currentThread = threads[0];

  const initialMessage = currentThread?.messages?.[0];
  const [messages, setMessages] = useState(
    initialMessage
      ? [{ message: initialMessage, threadId: currentThread._id }]
      : []
  );

  const pump = ({ action, threadId } = {}) => {
    if (action === "THREAD_CHANGE" && threadId) {
      const newThread = currentChat.threads.find(
        (thread) => thread._id === threadId
      );
      if (newThread) {
        setThreads((prevThreads) => [newThread, ...prevThreads]);
        const nextMessage = newThread.messages[0];
        if (nextMessage) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: nextMessage, threadId: newThread._id },
          ]);
        }
      }
    } else if (action === "THREAD_BACK") {
      const newThread = threads[1];
      if (newThread) {
        setThreads((prevThreads) => prevThreads.slice(1));
        const { message: lastMessage } = messages
          .slice()
          .reverse()
          .find(({ threadId }) => threadId === newThread._id);
        const i = newThread.messages.findIndex(
          (message) => message._id === lastMessage._id
        );
        const nextMessage = newThread.messages[i + 1];
        if (nextMessage) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: nextMessage, threadId: newThread._id },
          ]);
        }
      }
    } else {
      const { message: lastMessage } = messages
        .slice()
        .reverse()
        .find(({ threadId }) => threadId === currentThread._id);
      const i = currentThread.messages.findIndex(
        (message) => message._id === lastMessage._id
      );
      const nextMessage = currentThread.messages[i + 1];
      if (nextMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: nextMessage, threadId: currentThread._id },
        ]);
      }
    }
  };

  console.log(messages);

  return (
    <>
      <hr />
      {messages?.map(({ message }) => {
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
