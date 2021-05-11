import React from 'react';
import { useQuery, useStoryJson } from '../utils/hooks.js';
import { StoryContainer } from '../components/StoryContainer.jsx';
import { ChatContainer } from '../components/ChatContainer.jsx';

export const Story = () => {
  const query = useQuery();
  const storyId = query.get('id');
  const { loading, error, data: story } = useStoryJson(storyId);

  const chatId = query.get('chat');
  const chat = story?.chats?.find((c) => c._id === chatId);

  return (
    <div className="container">
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
          return <StoryContainer story={story} />;
        }
        return <ChatContainer story={story} chat={chat} />;
      })()}
    </div>
  );
};
