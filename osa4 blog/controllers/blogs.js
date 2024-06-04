const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    if (!body.userId)
      return response.status(400).json({ error: "userId required" });

    const user = await User.findById(body.userId);
    logger.info("userID:", body.userId);
    logger.info("user:", user);

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
    });

    const savedBlog = await newBlog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (e) {
    next(e);
  }
});

blogRouter.delete("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    await Blog.findByIdAndDelete(id);
    response.status(204).send();
  } catch (e) {
    console.error(e);
    response.status(400).send();
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
