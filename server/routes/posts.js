const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

//создать пост
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})