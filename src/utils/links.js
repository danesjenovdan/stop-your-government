export const getStoryLink = (storyId, lang) =>
  `/story?id=${storyId}&lang=${lang}`;

export const getChatLink = (storyId, chatId, lang) =>
  `/story?id=${storyId}&chat=${chatId}&lang=${lang}`;
