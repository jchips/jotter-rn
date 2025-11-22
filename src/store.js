import { configureStore } from '@reduxjs/toolkit'
import configReducer from './reducers/configReducer';
import recentsReducer from './reducers/recentsReducer';

export default configureStore({
  reducer: {
    configs: configReducer,
    recents: recentsReducer
  },
});