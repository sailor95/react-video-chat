import { createSlice } from '@reduxjs/toolkit';
import { storeType } from '../../store';

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    appId: '',
    token: '',
    channel: '',
  },
  reducers: {
    setRoomInfo: (state, action) => {
      const { appId, token, channel } = action.payload;

      state.appId = appId;
      state.token = token;
      state.channel = channel;
    },
  },
});

// Action creators
export const { setRoomInfo } = roomSlice.actions;

// Selectors
export const selectAppId = (state: storeType) => state.room.appId;
export const selectToken = (state: storeType) => state.room.token;
export const selectChannel = (state: storeType) => state.room.channel;

export default roomSlice.reducer;
