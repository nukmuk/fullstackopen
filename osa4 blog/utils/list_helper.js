const _ = require("lodash/core");

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

const mostBlogs = (blogs) => {
  let authors = {};
  for (const blog of blogs) {
    if (!authors[blog.author]) {
      authors[blog.author] = 1;
      continue;
    }
    authors[blog.author] += 1;
  }
  const result = _.reduce(
    authors,
    (most, blogs, name) => {
      console.log(most, blogs, name);
      if (!most) return { author: name, blogs };
      if (blogs > most.blogs) return { author: name, blogs };
      return most;
    },
    null
  );
  return result;
};

const mostLikes = (blogs) => {
  let likes = {};
  for (const blog of blogs) {
    if (!likes[blog.author]) likes[blog.author] = 0;
    likes[blog.author] += blog.likes;
  }
  const result = _.reduce(
    likes,
    (most, likes, name) => {
      console.log(most, likes, name);
      if (!most) return { author: name, likes };
      if (likes > most.likes) return { author: name, likes };
      return most;
    },
    null
  );
  return result;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
