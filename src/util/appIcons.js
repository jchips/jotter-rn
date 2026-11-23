const appIcons = (COLORS) => {
  const text = COLORS.text.substring(1);
  const text2 = COLORS.text2.substring(1);

  const iconSize = 100;
  const icons = {
    show: `https://img.icons8.com/material-outlined/${iconSize}/${text2}/visible--v1.png`,
    hide: `https://img.icons8.com/material-outlined/${iconSize}/${text2}/invisible.png`,
  };
  return icons;
};

export default appIcons;
