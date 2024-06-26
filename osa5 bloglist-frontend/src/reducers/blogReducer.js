import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(_state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      return state.concat(action.payload);
    },
    removeBlogFromState(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, appendBlog, removeBlogFromState } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    console.log("setting blogs to:", blogs);
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (title, author, url, user) => {
  return async (dispatch) => {
    const newBlog = await blogService.create({ title, author, url }, user);
    console.log("created blog :", newBlog);
    dispatch(appendBlog(newBlog));
  };
};

export const removeBlog = (id, user) => {
  return async (dispatch) => {
    const removedBlog = await blogService.remove(id, user);
    console.log("removed blog:", removedBlog);
    dispatch(removeBlogFromState(id));
  };
};

export default blogSlice.reducer;
