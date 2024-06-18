import { createSlice } from "@reduxjs/toolkit";

let timeout = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState: "test notification",
  reducers: {
    setNotificationText(_state, action) {
      return action.payload;
    },
    removeNotification() {
      return null;
    },
  },
});

export const { setNotificationText, removeNotification } =
  notificationSlice.actions;

export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch(setNotificationText(message));
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      dispatch(removeNotification());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
