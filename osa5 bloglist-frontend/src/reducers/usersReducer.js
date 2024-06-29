import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(_state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    userService.getAll().then((users) => {
      dispatch(setUsers(users));
      console.log("users set to", users);
    });
  };
};

export default usersSlice.reducer;
