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


