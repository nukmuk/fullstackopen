import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification(state, action) {
      console.log("addnotification:", action);
      return state.concat({ ...action.payload });
    },
    removeNotification(state, action) {
      return state.filter((n) => n.index !== action.payload);
    },
  },
});

const { addNotification, removeNotification } = notificationsSlice.actions;

let notificationIndex = 0;

export const showNotification = (message, error = false, seconds = 5) => {
  return async (dispatch) => {
    let notification = { message, seconds, error, index: notificationIndex };
    notificationIndex++;
    dispatch(addNotification(notification));
    setTimeout(() => {
      dispatch(removeNotification(notification.index));
    }, seconds * 1000);
  };
};

export default notificationsSlice.reducer;
