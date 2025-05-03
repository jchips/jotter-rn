const COMMON_COLORS = {
  themePurple: '#3b45ff',
  themePurpleText: '#646cff',
  themePurpleLabel: '#737bff', // update form
  themePurpleLight: '#3b45ff33',
  mutedtext: '#a1a1aa',
  mutedPurple: '#1c27ff',
  mutedBlack: '#2e2e33',
  danger: '#dc3545',
  disabled: '#000abc',
  white: '#ffffff',
  offWhite: '#e4e4e7',
  black: '#09090B',
  darkTheme: '#18181b',
  cardBgDark: '#1f1f23',
  sectionBg: '#1a1a1d',
}

const NO_HASH = {
  textNH: '646cff',
  warningYellowNH: 'eed202',
  dangerNH: 'dc3545',
  whiteNH: 'ffffff',
  offWhiteNH: 'e4e4e7',
  blackNH: '09090B',
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
  border: COMMON_COLORS.offWhite,
  border2: COMMON_COLORS.offWhite, // editor divider
  borderDark: '#dddddd', // drawer divider
  authBtn: COMMON_COLORS.black,
  mutedBtn: COMMON_COLORS.mutedBlack,
  placeHolderText: '#6B7280',
  block: '#F5F5F5', // markdown block
  themeBtnNH: NO_HASH.blackNH,
  noteBtnNH: NO_HASH.blackNH,
  errAlert: '#fee2e2',
  errText: '#991919',
  ...COMMON_COLORS,
  ...NO_HASH
}

const dark = {
  background: COMMON_COLORS.darkTheme,
  text: COMMON_COLORS.offWhite, // '#f4f4f4'
  text2: COMMON_COLORS.themePurpleText,
  cardBg: COMMON_COLORS.cardBgDark,
  modalBg: COMMON_COLORS.sectionBg,
  popover: COMMON_COLORS.sectionBg,
  subtle: '#222228',
  faded: COMMON_COLORS.cardBgDark,
  border: '#27272a',
  border2: '#242424', // editor divider
  borderDark: '#161616', // drawer divider
  authBtn: COMMON_COLORS.themePurple,
  mutedBtn: COMMON_COLORS.mutedPurple,
  placeHolderText: '#9CA3AF',
  block: COMMON_COLORS.cardBgDark, // markdown block
  themeBtnNH: NO_HASH.textNH,
  noteBtnNH: NO_HASH.offWhiteNH,
  errAlert: '#300c0c',
  errText: '#fca5a5',
  ...COMMON_COLORS,
  ...NO_HASH
}

export { light, dark };