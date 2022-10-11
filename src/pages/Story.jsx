import React from 'react';
import { useQuery, useStoryJson } from '../utils/hooks.js';
import { ChatContainer } from '../components/ChatContainer.jsx';
import { StoryChats } from '../components/StoryChats.jsx';
import { VariablesDebug } from '../components/VariablesDebug.jsx';
import {
  CHARACTERS,
  CHARACTERS_HRV,
  CHARACTERS_SRP,
} from '../utils/character-stories.js';

const characters = {
  slv: CHARACTERS,
  hrv: CHARACTERS_HRV,
  srp: CHARACTERS_SRP,
};

export const Story = () => {
  const query = useQuery();
  const storyId = query.get('id');
  const lang = query.get('lang');
  const CHARS = characters[lang];
  const character = CHARS.find((c) => c.storyId === storyId);
  const { loading, error, data: story } = useStoryJson(storyId);

  const chatId = query.get('chat');
  const chat = story?.chats?.find((c) => c._id === chatId);

  return (
    <div className="container">
      <VariablesDebug />
      {(() => {
        if (loading) {
          return <h2>Loading story ...</h2>;
        }
        if (error) {
          return <h2>Error: {error?.message}</h2>;
        }
        if (!story) {
          return <h2>No story loaded!</h2>;
        }
        if (!chatId || !chat) {
          return <StoryChats story={story} character={character} />;
        }
        return (
          <ChatContainer
            key={chat._id}
            story={story}
            character={character}
            chat={chat}
          />
        );
      })()}
    </div>
  );
};
