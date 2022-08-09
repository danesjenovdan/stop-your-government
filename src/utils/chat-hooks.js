import { useEffect, useState } from 'react';

export const MESSAGE_DISPLAY = {
  WAITING: 'WAITING',
  WRITING: 'WRITING',
  SHOWN: 'SHOWN',
};

const getInitialMessageDisplay = (pauseBefore = 0, timeWriting = 0) => {
  if (pauseBefore > 0) return MESSAGE_DISPLAY.WAITING;
  if (timeWriting > 0) return MESSAGE_DISPLAY.WRITING;
  return MESSAGE_DISPLAY.SHOWN;
};

export const useMessageDisplay = ({ pauseBefore = 0, timeWriting = 0 }) => {
  const [displayState, setDisplayState] = useState(
    getInitialMessageDisplay(pauseBefore, timeWriting)
  );

  useEffect(() => {
    if (displayState === MESSAGE_DISPLAY.WAITING) {
      setTimeout(() => {
        setDisplayState(
          timeWriting > 0 ? MESSAGE_DISPLAY.WRITING : MESSAGE_DISPLAY.SHOWN
        );
      }, pauseBefore);
    } else if (displayState === MESSAGE_DISPLAY.WRITING) {
      setTimeout(() => {
        setDisplayState(MESSAGE_DISPLAY.SHOWN);
      }, timeWriting);
    }
  }, [displayState]);

  return displayState;
};

export const RESPONSE_DISPLAY = {
  INTERACTIVE: 'INTERACTIVE',
  MESSAGE: 'MESSAGE',
  HIDDEN: 'HIDDEN',
};

export const useResponseDisplay = ({ type, hideResponseToChat }) => {
  const [displayState, setDisplayState] = useState(
    type === 'NO_RESPONSE'
      ? RESPONSE_DISPLAY.HIDDEN
      : RESPONSE_DISPLAY.INTERACTIVE
  );

  const setResponded = ({
    type: responseType,
    hideResponseToChat: hideResponse,
  } = {}) => {
    const hide = responseType === 'options' ? hideResponse : hideResponseToChat;
    if (displayState === RESPONSE_DISPLAY.INTERACTIVE) {
      setDisplayState(
        hide ? RESPONSE_DISPLAY.HIDDEN : RESPONSE_DISPLAY.MESSAGE
      );
    }
  };

  return [displayState, setResponded];
};
