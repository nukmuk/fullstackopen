import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, test } from "vitest";
import { CreateBlog } from "./CreateBlog";

const testUser = {
  username: "root",
  name: "Root",
  token: "123",
};
const testBlog = {
  title: "Component testing is done with react-testing-library",
  id: "123abc",
  author: "kirjoittaja",
  url: "blog.com",
  likes: 10,
  user: testUser,
};

const options = {
  exact: false,
};

test("renders content", async () => {
  render(<Blog blog={testBlog} user={testUser} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");

  expect(screen.getByText(testBlog.title, options)).not.toBeNull();
  expect(screen.getByText(testBlog.author, options)).not.toBeNull();
  expect(screen.queryByText(testBlog.url, options)).toBeNull();
  expect(screen.queryByText(testBlog.likes, options)).toBeNull();

  await user.click(button);

  expect(screen.getByText(testBlog.url, options)).not.toBeNull();
  expect(screen.getByText(testBlog.likes, options)).not.toBeNull();
  expect(screen.getByText(testBlog.user.name, options)).not.toBeNull();
});

test("like button works", async () => {
  const mockHandler = vi.fn();

  render(
    <Blog
      blog={testBlog}
      user={testUser}
      likeFunction={mockHandler}
      setBlogs={() => {}}
    />
  );

  const user = userEvent.setup();
  const viewButton = screen.getByText("view");

  await user.click(viewButton);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test.only("<CreateBlog /> updates parent state and calls onSubmit", async () => {
  const createMock = vi.fn();

  render(<CreateBlog createBlog={createMock} />);

  const user = userEvent.setup();

  const inputs = screen.getAllByRole("textbox");
  const createButton = screen.getByText("create");

  await user.type(inputs[0], testBlog.title);
  await user.type(inputs[1], testBlog.author);
  await user.type(inputs[2], testBlog.url);
  await user.click(createButton);

  expect(createMock.mock.calls).toHaveLength(1);
  const correct = {
    title: testBlog.title,
    author: testBlog.author,
    url: testBlog.url,
  };
  expect(createMock.mock.calls[0][0]).toMatchObject(correct);
});
