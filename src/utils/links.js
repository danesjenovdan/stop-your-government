export const getStoryLink = (storyId) => `/story?id=${storyId}`;

export const getChatLink = (storyId, chatId) =>
  `/story?id=${storyId}&chat=${chatId}`;
