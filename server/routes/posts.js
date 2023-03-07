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

//обновить пост
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId == req.body.userId) {
            await Post.updateOne({ $set: req.body })
            res.status(200).json('Пост успешно обновлен')
        } else {
            res.status(403).json('Вы можете обновить только свои посты')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//удалить пост
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId == req.body.userId) {
            await Post.deleteOne()
            res.status(200).json('Пост успешно удален!')
        } else {
            return res.status(403).json('Вы можете удалить только свой пост!')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//like/dislike пост
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('Ваш лайк к посту добавлен!')
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json('Вам не понравился данный пост!')
        }
    } catch (error) {
       res.status(500).json(error) 
    }
})

//получить пост
router.get('/:id', async (req, res) => {
    try {
       const post = Post.findById(req.params.id)
       res.status(200).json(post) 
    } catch (error) {
        res.status(500).json(error)
    }
})

//получить посты в хронологическом порядке
router.get('/timeline/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    }
})

//получить все посты пользователя
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user._id })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router