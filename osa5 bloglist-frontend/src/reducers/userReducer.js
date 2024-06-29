import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload;
    },
    initializeUser() {
      return JSON.parse(window.localStorage.getItem("user"));
    },
  },
});

export const { setUser, initializeUser } = userSlice.actions;

export default userSlice.reducer;
