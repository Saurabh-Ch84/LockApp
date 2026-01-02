import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import blockReducer from './features/blockSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blocklist: blockReducer,
  },
});