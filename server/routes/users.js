const User = require('../models/User')
const router = require('express').Router()
const bcrypt = require('bcrypt')

//получить пользователя
router.get('/', async(req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username })
        const { password, updateAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})

