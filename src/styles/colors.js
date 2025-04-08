const COMMON_COLORS = {
  themePurple: '#3b45ff',
  themePurpleText: '#646cff',
  themePurpleLight: '#3b45ff33',
  mutedtext: '#a1a1aa',
  // graySubtle: '#f4f4f5',
  danger: '#dc3545',
  btn1Hover: '#000abc',
  white: '#ffffff'
  // disabled: '#000abc'
}

const NO_HASH = {
  textNoHash: '646cff',
  warningYellowNH: 'eed202',
  dangerNH: 'dc3545',
  whiteNoHash: 'ffffff',
}

const light = {
  background: '#ffffff',
  text: '#213547',
  text2: '#213547',
  // text: '#242424',
  cardBg: '#ffffff',
  graySubtle: '#f4f4f5',
  faded: '#f4f4f4',
  border: '#e4e4e7',
  borderLight: '#e4e4e766',
  borderDark: '#dddddd',
  logoutBtn: '#213547',
  placeHolderText: '#6B7280',
  // placeHolderText: '#9CA3AF',
  blockquote: '#F5F5F5',
  themeNoHash: '000000',
  noteMoreNoHash: '000000',
  ...COMMON_COLORS,
  ...NO_HASH
}

const dark = {
  // background: '#242424',
  background: '#18181b',
  text: '#f4f4f4',
  text2: COMMON_COLORS.themePurpleText,
  // text: '#ffffffde',
  cardBg: '#111111',
  graySubtle: '#242424',
  // graySubtle: '#18181b',
  faded: '#242424',
  border: '#27272a',
  borderLight: '#e4e4e766',
  borderDark: '#27272a',
  logoutBtn: '#3b45ff',
  placeHolderText: '#9CA3AF',
  // placeHolderText: '#e4e4e766',
  blockquote: '#111111',
  themeNoHash: '646cff',
  // themeNoHash: '3b45ff',
  noteMoreNoHash: 'e4e4e7',
  ...COMMON_COLORS,
  ...NO_HASH
}

export { light, dark };