// export { default as app } from './appDefault';
// export * from './colors';
// // export { default as COLORS } from './colors';
// export * from './constants';
// export { default as buttons } from './buttons';
// export { default as noteView } from './note';
// export { default as MODAL } from './modal';
// export { default as POPOVER } from './popover';
// export { default as MARKDOWN } from './markdown';

import { useTheme } from '../contexts/ThemeContext';
import app from './appDefault';
import buttons from './buttons';
import MODAL from './modal';
import MARKDOWN from './markdown';
import POPOVER from './popover';
export * from './constants';

export const useAppStyles = () => {
  const { COLORS } = useTheme();

  return {
    app: app(COLORS),
    MODAL: MODAL(COLORS, app(COLORS)),
    buttons: buttons(COLORS),
    MARKDOWN: MARKDOWN(COLORS),
    POPOVER: POPOVER(buttons(COLORS), COLORS),
    COLORS,
  };
};

export { default as noteView } from './note';


