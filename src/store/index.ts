import { configureStore, combineReducers } from '@reduxjs/toolkit';

import room from '../components/room/roomSlice';

const rootReducer = combineReducers({
  room,
});

const store = configureStore({
  reducer: rootReducer,
});

export type storeType = ReturnType<typeof rootReducer>;

export default store;
