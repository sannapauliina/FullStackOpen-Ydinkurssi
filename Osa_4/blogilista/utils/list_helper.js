const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Eniten tykkäyksiä
  const favorite = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Blogien määrä per author
  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  // Eniten blogeja kirjoittanut
  let maxAuthor = null
  let maxBlogs = 0
  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = counts[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}

