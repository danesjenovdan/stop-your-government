import { createContext, useContext } from 'react';

const maybeScrollToBottom = () => {
  const scroller = document.documentElement;
  const scroll = scroller.scrollHeight - scroller.clientHeight;
  scroller.scrollTo(0, scroll);
  // TODO: check if near bottom, and not manually scrolled up
};

const ScrollToBottomContext = createContext({
  maybeScrollToBottom,
});

// export const ScrollToBottomProvider = ScrollToBottomContext.Provider;

export const useScrollToBottom = () => useContext(ScrollToBottomContext);
