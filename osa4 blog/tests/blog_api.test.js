const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const logger = require("../utils/logger");

const Blog = require("../models/blog");

const api = supertest(app);

const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
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

describe("blogs", async () => {
  const newBlog = {
    title: "test",
    author: "123",
    url: "https://asd.com/",
  };

  const newBlogResponse = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201);

  const response = await helper.blogsInDb();
  logger.info("hello", newBlogResponse.status);
  logger.info("hello", response);

  test("can be added with POST request", () => {
    assert.strictEqual(response.length, helper.initialBlogs.length + 1);
  });

  test("with unspecified likes default to 0", () => {
    const newBlogFromResponse = response.find(
      (blog) => blog.id === newBlogResponse.body.id
    );
    assert.strictEqual(newBlogFromResponse.likes, 0);
  });

  test("added without name or url return 400 bad response", async () => {
    const invalidBlog = structuredClone(newBlog);
    delete invalidBlog.title;
    const invalidBlog2 = structuredClone(newBlog);
    delete invalidBlog2.url;
    await api.post("/api/blogs").send(invalidBlog).expect(400);
    await api.post("/api/blogs").send(invalidBlog2).expect(400);
  });

  test("can be deleted", async () => {
    const id = helper.initialBlogs[0]._id;

    const blogsBefore = await helper.blogsInDb();
    await api.delete(`/api/blogs/${id}`).expect(204);
    const blogsAfter = await helper.blogsInDb();

    assert.strictEqual(blogsBefore.length, blogsAfter.length + 1);
  });

  test("likes can be updated", async () => {
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
});

after(async () => {
  await mongoose.connection.close();
});
