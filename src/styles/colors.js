const COMMON_COLORS = {
  themePurple: '#3b45ff',
  themePurpleText: '#646cff',
  themePurpleLight: '#3b45ff33',
  mutedtext: '#a1a1aa',
  danger: '#dc3545',
  disabled: '#000abc',
  white: '#ffffff',
  black: '#000000',
  darkTheme: '#18181b',
}

const NO_HASH = {
  textNH: '646cff',
  warningYellowNH: 'eed202',
  dangerNH: 'dc3545',
  whiteNH: 'ffffff',
  blackNH: '000000',
}

const light = {
  background: COMMON_COLORS.white,
  text: '#213547',
  text2: '#213547',
  cardBg: '#ffffff',
  graySubtle: '#f4f4f5',
  faded: '#f4f4f4',
  border: '#e4e4e7',
  borderDark: '#dddddd',
  authBtn: COMMON_COLORS.black,
  placeHolderText: '#6B7280',
  block: '#F5F5F5',
  themeBtnNH: NO_HASH.blackNH,
  noteBtnNH: NO_HASH.blackNH,
  ...COMMON_COLORS,
  ...NO_HASH
}

const dark = {
  background: COMMON_COLORS.darkTheme,
  text: '#f4f4f4',
  text2: COMMON_COLORS.themePurpleText,
  cardBg: '#111111',
  graySubtle: '#242424',
  faded: '#242424',
  border: '#27272a',
  borderDark: '#27272a',
  authBtn: '#3b45ff',
  placeHolderText: '#9CA3AF',
  block: '#111111',
  themeBtnNH: '646cff',
  noteBtnNH: 'e4e4e7',
  ...COMMON_COLORS,
  ...NO_HASH
}

export { light, dark };