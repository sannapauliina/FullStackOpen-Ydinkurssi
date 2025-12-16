const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// Testien lähtödata
const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author1',
    url: 'http://example.com/1',
    likes: 4
  },
  {
    title: 'Second blog',
    author: 'Author2',
    url: 'http://example.com/2',
    likes: 9
  }
]

// Tietokannan tyhjennys ja alustus ennen jokaista testiä
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('GET /api/blogs', () => {
  test('returns blogs as JSON and correct length', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log('Blogs returned:', response.body.length)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('GET /api/blogs', () => {
  test('blogs have field id instead of _id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body
    blogs.forEach(blog => {
      assert.ok(blog.id, 'Blog should have id field')
      assert.strictEqual(blog._id, undefined, 'Blog should not have _id field')
    })
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Author3',
      url: 'http://example.com/new',
      likes: 10
    }

    // Blogit ennen POSTia
    const blogsAtStart = await api.get('/api/blogs')

    // Uusi blogi
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Blogit POSTin jälkeen
    const blogsAtEnd = await api.get('/api/blogs')

    // Määrän kasvun varmistus
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)

    // Uuden blogin löytymisen varmistus
    const titles = blogsAtEnd.body.map(b => b.title)
    assert.ok(titles.includes('New blog'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
