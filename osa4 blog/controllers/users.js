const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3)
    return response.status(400).json({ error: "password too short" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await User.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const resUser = await User.findById(id).populate("blogs");
  response.json(resUser);
});

module.exports = usersRouter;
