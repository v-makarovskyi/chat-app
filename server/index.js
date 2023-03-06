const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const multer = require('multer')
const { default: helmet } = require('helmet')

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


app.listen(8800, () => {
    console.log(`Backend server is running on port ${process.env.PORT}`)
})
