import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getChatLink } from '../utils/links.js';
import { deleteStoredVariables } from '../utils/variables.js';

export const StoryChats = ({ story }) => {
  const history = useHistory();

  const mainChat = story?.chats?.find((c) => c.isMainChat);
  const [selectedChatId, setSelectedChatId] = useState(mainChat._id);

  const onChatClick = (chatId) => {
    setSelectedChatId(chatId);
  };

  const onStartClick = () => {
    const chatLink = getChatLink(story._id, selectedChatId);
    history.push(chatLink);
  };

  const onDeleteClick = () => {
    deleteStoredVariables();
  };

  return (
    <>
      <div>Chats:</div>
      <ul>
        {story?.chats.map((chat) => (
          <li key={chat._id}>
            <button
              type="button"
              style={{
                fontWeight: chat._id === selectedChatId ? '700' : '400',
              }}
              onClick={() => onChatClick(chat._id)}
            >
              {chat.title}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <button type="button" onClick={onStartClick}>
          Start
        </button>
      </div>
      <br />
      <br />
      <br />
      <div>
        <button type="button" onClick={onDeleteClick}>
          Delete all variables
        </button>
      </div>
    </>
  );
};
