import { createAsyncThunk } from '@reduxjs/toolkit';

//reset error action

export const resetError = createAsyncThunk("resetError", () => {
  return {};
});

//reset success action

export const resetSuccess = createAsyncThunk(
  "resetSuccess",
  () => {
    return {};
  }
);