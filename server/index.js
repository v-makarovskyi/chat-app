const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const multer = require('multer')
const { default: helmet } = require('helmet')
const port = process.env.PORT || 8800

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const conversationRoute = require('./routes/conversations')
const messagesRoute = require('./routes/messages')

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(console.log('БД подклечена'))
.catch((error) => console.log(error))

app.use('/images', express.static(path.join(__dirname, 'public/images')))

app.use(express.json())
app.use(helmet())
app.use(morgan('common'))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage: storage })
app.post('api/upload', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json('Файл успешно загружен')
    }
    catch (error) {
        console.error(error)
    }
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postsRoute)
app.use('/api/conversation', conversationRoute)
app.use('/api/messages', messagesRoute)


app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`)
})
