const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = [
    { title: 'Blog1', author: 'Author1', url: 'url1', likes: 7 },
    { title: 'Blog2', author: 'Author2', url: 'url2', likes: 3 },
    { title: 'Blog3', author: 'Author1', url: 'url3', likes: 12 },
    { title: 'Blog4', author: 'Author1', url: 'url4', likes: 1 },
    { title: 'Blog5', author: 'Author2', url: 'url5', likes: 4 }
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(blogs)
    console.log('Most blogs author:', result.author, 'with', result.blogs, 'blogs')
    const expected = { author: 'Author1', blogs: 3 }
    assert.deepStrictEqual(result, expected)
  })
})

describe('favorite blog', () => {
  const listWithManyBlogs = [
    { title: 'Blog1', author: 'Author1', url: 'url1', likes: 7 },
    { title: 'Blog2', author: 'Author2', url: 'url2', likes: 3 },
    { title: 'Blog3', author: 'Author3', url: 'url3', likes: 12 }
  ]

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('of a bigger list is the one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    console.log('Favorite blog title:', result.title)
    const expected = { title: 'Blog3', author: 'Author3', url: 'url3', likes: 12 }
    assert.deepStrictEqual(result, expected)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    { title: 'Blog1', author: 'Author1', url: 'url1', likes: 7 },
    { title: 'Blog2', author: 'Author2', url: 'url2', likes: 3 },
    { title: 'Blog3', author: 'Author3', url: 'url3', likes: 12 }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    console.log('Total likes:', result)
    assert.strictEqual(result, 22)
  })
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
