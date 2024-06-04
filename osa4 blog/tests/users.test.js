const mongoose = require("mongoose");
const { describe, test, beforeEach, after } = require("node:test");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const helper = require("./test_helper");

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    // console.log("users:", usersAtEnd);
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  describe("creation fails when", () => {
    test("username is too short", async () => {
      const invalidUser = {
        username: "ro",
        name: "Superuser",
        password: "salainen",
      };
      await api
        .post("/api/users")
        .send(invalidUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });
    test("password is too short", async () => {
      const invalidUser = {
        username: "root",
        name: "Superuser",
        password: "sa",
      };
      const response = await api
        .post("/api/users")
        .send(invalidUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);
      assert(response.body.error.includes("too short"));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
