import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlog, user) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const like = async (blogId) => {
  const blogs = await getAll();
  const blogToLike = blogs.find((b) => b.id === blogId);
  if (!blogToLike) return console.error(`blog ${blogId} to like not found`);
  const beforeLikes = blogToLike.likes;
  const response2 = await axios.patch(`${baseUrl}/${blogId}`, {
    likes: beforeLikes + 1,
  });
  return response2.data;
};

export default { getAll, create, like };
