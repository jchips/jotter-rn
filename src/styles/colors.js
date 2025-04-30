const COMMON_COLORS = {
  themePurple: '#3b45ff',
  themePurpleText: '#646cff',
  themePurpleLabel: '#737bff',
  themePurpleLight: '#3b45ff33',
  mutedtext: '#a1a1aa',
  mutedPurple: '#1c27ff',
  mutedBlack: '#2e2e33',
  danger: '#dc3545',
  disabled: '#000abc',
  white: '#ffffff',
  black: '#000000',
  darkTheme: '#121212',
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
  cardBg: COMMON_COLORS.white,
  modalBg: COMMON_COLORS.white,
  popover: COMMON_COLORS.white,
  subtle: '#f4f4f5',
  faded: '#f4f4f4',
  border: '#e4e4e7',
  border2: '#e4e4e7',
  borderDark: '#dddddd',
  authBtn: COMMON_COLORS.black,
  mutedBtn: COMMON_COLORS.mutedBlack,
  placeHolderText: '#6B7280',
  block: '#F5F5F5',
  themeBtnNH: NO_HASH.blackNH,
  noteBtnNH: NO_HASH.blackNH,
  errAlert: '#fee2e2',
  errText: '#991919',
  ...COMMON_COLORS,
  ...NO_HASH
}

const dark = {
  background: COMMON_COLORS.darkTheme,
  text: '#e4e4e7', // '#f4f4f4'
  text2: COMMON_COLORS.themePurpleText,
  cardBg: '#18181a',
  modalBg: '#1a1a1a',
  popover: '#111111',
  subtle: '#1d1d1d',
  faded: '#18181b',
  border: '#27272a',
  border2: '#1d1d1d',
  borderDark: '#18181b',
  authBtn: COMMON_COLORS.themePurple,
  mutedBtn: COMMON_COLORS.mutedPurple,
  placeHolderText: '#9CA3AF',
  block: '#18181b',
  themeBtnNH: NO_HASH.textNH,
  noteBtnNH: 'e4e4e7',
  errAlert: '#300c0c',
  errText: '#fca5a5',
  ...COMMON_COLORS,
  ...NO_HASH
}

export { light, dark };