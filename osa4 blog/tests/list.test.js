const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const blogs = require("./blogs");
const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("of a bigger list is calculated right", () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36);
  });
});

describe("favorite blog", () => {
  test("of a bigger list is picked correctly", () => {
    let correct = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), correct);
  });

  test("of single list is the only one", () => {
    let correct = structuredClone(listWithOneBlog[0]);
    delete correct._id;
    delete correct.url;
    delete correct.__v;
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), correct);
  });

  test("of empty list is null", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null);
  });
});
