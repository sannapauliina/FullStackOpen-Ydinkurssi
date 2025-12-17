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

describe('POST /api/blogs', () => {
  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author4',
      url: 'http://example.com/nolikes'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Varmistus että tykkäysten määrä on 0
    assert.strictEqual(response.body.likes, 0)
  })
})

describe('POST /api/blogs', () => {
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Author5',
      url: 'http://example.com/notitle',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Blog without url',
      author: 'Author6',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('a blog can be deleted', async () => {
    
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

    const ids = blogsAtEnd.body.map(b => b.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('returns 404 if blog does not exist', async () => {
    const nonExistingId = new mongoose.Types.ObjectId() // luodaan validi mutta olematon id

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(404)
  })

  test('returns 400 if id is invalid', async () => {
    await api
      .delete('/api/blogs/12345') // ei validi ObjectId
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
