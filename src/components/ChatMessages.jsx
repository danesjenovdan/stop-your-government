import React, { useState } from 'react';
import styles from './ChatMessages.module.scss';
import { ChatMessage } from './ChatMessage.jsx';

export const ChatMessages = ({ story, chat }) => {
  const initialThread = chat.threads?.[0];
  const [threads, setThreads] = useState(initialThread ? [initialThread] : []);
  const thread = threads[0];

  const initialMessage = thread?.messages?.[0];
  const [messages, setMessages] = useState(
    initialMessage ? [{ message: initialMessage, threadId: thread._id }] : []
  );

  const pump = ({ action, threadId, threadName } = {}) => {
    if (action === 'THREAD_CHANGE' && (threadId || threadName)) {
      let newThread = null;
      if (threadId) {
        newThread = chat.threads.find((t) => t._id === threadId);
      } else if (threadName) {
        newThread = chat.threads.find((t) => t.name === threadName);
      }
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
    } else if (action === 'THREAD_BACK' || action === 'THREAD_BACK_TO_MAIN') {
      const newThreadIndex =
        action === 'THREAD_BACK_TO_MAIN' ? threads.length - 1 : 1;
      const newThread = threads[newThreadIndex];
      if (newThread) {
        setThreads((prevThreads) => prevThreads.slice(newThreadIndex));
        const { message: lastMessage } = messages
          .slice()
          .reverse()
          .find((m) => m.threadId === newThread._id);
        const i = newThread.messages.findIndex(
          (m) => m._id === lastMessage._id
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
        .find((m) => m.threadId === thread._id);
      const i = thread.messages.findIndex((m) => m._id === lastMessage._id);
      const nextMessage = thread.messages[i + 1];
      if (nextMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: nextMessage, threadId: thread._id },
        ]);
      }
    }
  };

  return (
    <div className={styles.messages}>
      {messages?.map(({ message, threadId }) => {
        const actor = story.actors.find((a) => a._id === message.actor);
        const tcid = message.actionOptions?.triggerChatId;
        const triggerChat = tcid && story.chats.find((c) => c._id === tcid);
        return (
          <ChatMessage
            key={message._id}
            message={message}
            actor={actor}
            triggerChat={triggerChat}
            story={story}
            threadId={threadId}
            pump={pump}
          />
        );
      })}
    </div>
  );
};
