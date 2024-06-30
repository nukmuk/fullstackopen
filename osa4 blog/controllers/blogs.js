const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
  Blog.find({})
    .populate("user", { blogs: 0 })
    .then((blogs) => {
      response.json(blogs);
    });
});

blogRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const resBlog = await Blog.findById(id).populate("user");
  response.json(resBlog);
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    console.log("token is:", request.token);
    console.log("user is:", request.user);

    if (!request.user)
      return response.status(401).send({ error: "not logged in" });

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: request.user._id,
    });
    console.log("creating blog:", body);
    console.log("blog:", newBlog);

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
    if (!request.user) return response.status(401).send();
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

blogRouter.post("/:id/comments", async (request, response, next) => {
  try {
    const body = request.body;
    const blogId = request.params.id;

    const blogToUpdate = await Blog.findById(blogId);
    blogToUpdate.comments.push(body);
    const savedBlog = await blogToUpdate.save();

    console.log("creating comment, blogId:", body, blogId);

    response.status(201).json(savedBlog);
  } catch (e) {
    next(e);
  }
});

module.exports = blogRouter;
