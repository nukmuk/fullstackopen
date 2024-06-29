import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./reducers/notificationsReducer";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import usersReducer from "./reducers/usersReducer";

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
});

export default store;
