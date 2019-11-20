const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

router.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    next(error)
  }

})

router.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response
        .status(404)
        .json({ error: 'blog not found' })
        .end()
    }

    await Blog.findByIdAndRemove(request.params.id)
    return response
      .status(204)
      .end()
  } catch (error) {
    return next(error)
  }
})

module.exports = router