const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')


// Routes
const authRoute = require('./routes/auth')
const favoritesRoute = require('./routes/favorites')
const pokemonRoute = require('./routes/pokemon')

dotenv.config()

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db')
)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

// Route Middleware
app.use('/api/user', authRoute)
app.use('/api/favorites', favoritesRoute)
app.use('/api/pokemon', pokemonRoute)

app.listen(3000, () => console.log('Up and working'))