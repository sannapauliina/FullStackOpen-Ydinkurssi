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

after(async () => {
  await mongoose.connection.close()
})
