import React from 'react';
// import { StoryPoster } from './StoryPoster.jsx';
import { ChatMessages } from './ChatMessages.jsx';

export const ChatContainer = ({ story, chat }) => (
  <>
    {/* <StoryPoster poster={chat.poster} /> */}
    <ChatMessages story={story} chat={chat} />
  </>
);
