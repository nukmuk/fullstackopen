const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs");

const Blog = require("../models/blog");

const api = supertest(app);

const helper = require("./test_helper");
const User = require("../models/user");

let user = {};
let token = null;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  user = new User({ username: "root", passwordHash });

  await user.save();

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  token = `Bearer ${loginResponse.body.token}`;
  console.log("token set to", token);
  console.log("found user:", user);

  const initialBlogs = helper.initialBlogs.map((b) => ({
    ...b,
    user: user._id.toString(),
  }));
  await Blog.insertMany(initialBlogs);
});

test("correct amount of blogs and they are json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("blogs have id field", async () => {
  const response = await helper.blogsInDb();
  assert(!!response[0].id);
});

test("blogs can be added with POST request", async () => {
  console.log("creating new blog...");

  const newBlog = {
    title: "test",
    author: "123",
    url: "https://asd.com/",
  };

  const newBlogResponse = await api
    .post("/api/blogs")
    .set("Authorization", token)
    .send(newBlog)
    .expect(201);

  const response = await helper.blogsInDb();
  assert.strictEqual(response.length, helper.initialBlogs.length + 1);
});

test("blog with unspecified likes default to 0", async () => {
  console.log("creating new blog...");

  const newBlog = {
    title: "test",
    author: "123",
    url: "https://asd.com/",
  };

  const newBlogResponse = await api
    .post("/api/blogs")
    .set("Authorization", token)
    .send(newBlog)
    .expect(201);

  const response = await helper.blogsInDb();
  logger.info("hello", newBlogResponse.status);
  logger.info("hello", response);
  const newBlogFromResponse = response.find(
    (blog) => blog.id === newBlogResponse.body.id
  );
  assert.strictEqual(newBlogFromResponse.likes, 0);
});

test("blog added without name or url return 400 bad response", async () => {
  const newBlog = {
    title: "test",
    author: "123",
    url: "https://asd.com/",
  };

  const invalidBlog = structuredClone(newBlog);
  delete invalidBlog.title;
  const invalidBlog2 = structuredClone(newBlog);
  delete invalidBlog2.url;
  await api
    .post("/api/blogs")
    .set("Authorization", token)
    .send(invalidBlog)
    .expect(400);
  await api
    .post("/api/blogs")
    .set("Authorization", token)
    .send(invalidBlog2)
    .expect(400);
});

test("blog can be deleted", async () => {
  const id = helper.initialBlogs[0]._id;

  const blogsBefore = await helper.blogsInDb();
  await api.delete(`/api/blogs/${id}`).set("Authorization", token).expect(204);
  const blogsAfter = await helper.blogsInDb();

  assert.strictEqual(blogsBefore.length, blogsAfter.length + 1);
});

test("blog likes can be updated", async () => {
  const blogs = await helper.blogsInDb();
  const firstBlog = blogs[0];
  const newLikes = firstBlog.likes + 20;
  await api
    .patch(`/api/blogs/${firstBlog.id}`)
    .send({ likes: newLikes })
    .expect(200);

  const blogsAfter = await helper.blogsInDb();
  const firstBlogAfter = blogsAfter.find((blog) => blog.id === firstBlog.id);

  assert.strictEqual(firstBlogAfter.likes, newLikes);
});

after(async () => {
  await mongoose.connection.close();
});
