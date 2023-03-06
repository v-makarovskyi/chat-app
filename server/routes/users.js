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

//обновить данные пользователя
router.put('/:id', async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
            const user = User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json('Аккаунт успешно обновлен')
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json('Вы можете обновить только свой аккаунт!')
    }
})

//удалить пользователя
router.delete('/:id', async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json('Аккаунт успешно удален')
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json('Вы можете удалить только свой аккаунт')
    }
})

//получть друзей
router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId)
            })
        )
        let friedsList = []
        friends.map((friend) => {
            const {_id, username, profilePicture} = friend
            friedsList.push({_id, username, profilePicture})
        })
        res.status(200).json(friedsList)
    } catch (error) {
        res.status(500).json(error)
    }
})