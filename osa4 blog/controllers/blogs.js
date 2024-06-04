const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    logger.info("userID:", body.userId);
    logger.info("user:", request.user);

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: request.user._id,
    });

    const savedBlog = await newBlog.save();

    request.user.blogs = request.user.blogs.concat(savedBlog._id);
    await request.user.save();

    response.status(201).json(savedBlog);
  } catch (e) {
    next(e);
  }
});

blogRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const blogToDelete = await Blog.findById(id);
    if (!blogToDelete) return response.status(404).send();
    const userString = blogToDelete.user.toString();
    if (userString !== request.user.id)
      return response.status(401).json({ error: "blog not created by you" });

    await Blog.findByIdAndDelete(id);
    response.status(204).send();
  } catch (e) {
    next(e);
  }
});

blogRouter.patch("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const newBlog = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {
      new: true,
    });
    response.status(200).send(updatedBlog);
  } catch (e) {
    response.status(400).end();
  }
});

module.exports = blogRouter;
