import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { StoryPoster } from './StoryPoster.jsx';

const getChatLink = (storyId, chatId) => `/story?id=${storyId}&chat=${chatId}`;

export const StoryContainer = ({ story }) => (
  <>
    <StoryPoster poster={story.poster} />
    <p>Select chat:</p>
    <ul>
      {story.chats.map((chat) => (
        <li key={chat._id}>
          <Link
            to={getChatLink(story._id, chat._id)}
            className={classNames({ strong: chat.isMainChat })}
          >
            {chat.title}
          </Link>
          <br />
          <small>{chat.description}</small>
        </li>
      ))}
    </ul>
  </>
);
