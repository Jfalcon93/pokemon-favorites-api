const router = require('express').Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {
    
    // Validate data before creating
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // Check is user already exists
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already exists')
    
    // Hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    
    // New user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        favorites: []
    })
    try {
        const savedUser = await user.save()
        res.send({user: user._id, favorites: user.favorites})
    } catch(err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    
    // Validate Login
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // Check is email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email or password is incorrect')
    
    // Password validation
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email or password is incorrect')
    
    // Create Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
    
})

module.exports = router