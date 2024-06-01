const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => {
    likes += blog.likes;
    return likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  let favorite = blogs.reduce((favorite, blog) => {
    if (favorite === null) return blog;
    if (blog.likes > favorite.likes) return blog;
    return favorite;
  }, null);
  if (!favorite) return null;
  const { title, author, likes } = favorite;
  favorite = { title, author, likes };
  return favorite;
};

module.exports = { dummy, totalLikes, favoriteBlog };
