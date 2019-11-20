const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('identier is named id', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map(r => r.id)
  expect(ids).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 0,
  }

  console.log(`initial blogs ${helper.initialBlogs.length}`)
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()


  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map(r => r.title)
  expect(title)
    .toContain('Go To Statement Considered Harmful')
})

test('likes defaults to zero', async () => {
  const newBlog = {
    title: 'Async/Await',
    author: 'Me Luv',
    url: 'url',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const likes = blogsAtEnd
    .filter(r => r.title === 'Async/Await')
    .map(r => r.likes)

  expect(blogsAtEnd.length)
    .toBe(helper.initialBlogs.length + 1)

  expect(likes[0])
    .toBe(0)
})
test('fails with status code 400 if title invalid', async () => {
  const newBlog = {
    author: 'Me Luv',
    url: 'url',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length)
    .toBe(helper.initialBlogs.length)
})

test('fails with status code 400 if url invalid', async () => {
  const newBlog = {
    title: 'Async/Await',
    author: 'Me Luv',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length)
    .toBe(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})