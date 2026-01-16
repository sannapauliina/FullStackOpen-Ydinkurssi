const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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

let token

// Tietokannan tyhjennys ja alustus ennen jokaista testiä
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // luodaan testikäyttäjä
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  // kirjautuminen ja token talteen
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'sekret' })

  token = loginResponse.body.token

  // lisätään blogit käyttäjälle
  const blogsWithUser = initialBlogs.map(b => ({ ...b, user: user._id }))
  await Blog.insertMany(blogsWithUser)
})

// GET TESTIT

describe('GET /api/blogs', () => {
  test('returns blogs as JSON and correct length', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs have field id instead of _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

// POST TESTIT

describe('POST /api/blogs', () => {
  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Author3',
      url: 'http://example.com/new',
      likes: 10
    }

    const blogsAtStart = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)
  })

  test('adding a blog fails with 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Hacker',
      url: 'http://example.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author4',
      url: 'http://example.com/nolikes'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Author5',
      url: 'http://example.com/notitle',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Blog without url',
      author: 'Author6',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

// DELETE TESTIT

describe('DELETE /api/blogs/:id', () => {
  test('a blog can be deleted by the creator', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
  })

  test('returns 404 if blog does not exist', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('returns 400 if id is invalid', async () => {
    await api
      .delete('/api/blogs/12345')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

// PUT TESTIT

describe('PUT /api/blogs/:id', () => {
  test('a blog\'s likes can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = { likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })

  test('returns 404 if blog does not exist', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send({ likes: 99 })
      .expect(404)
  })

  test('returns 400 if id is invalid', async () => {
    await api
      .put('/api/blogs/12345')
      .send({ likes: 99 })
      .expect(400)
  })
})

// USER TESTIT

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test('creation fails if username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate',
      password: 'password123'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('username must be unique'))
  })

  test('creation fails if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Too Short',
      password: 'password123'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('is shorter than the minimum allowed length'))
  })

  test('creation fails if password is too short', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Valid User',
      password: 'ab'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('password must be at least 3 characters long'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
