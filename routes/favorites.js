const router = require('express').Router()
const User = require('../model/User')
const verify = require('./verifyToken')
const { validateFavorite, validateComment } = require('../validation')

router.get('/', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user})
    res.send(user.favorites)
})

router.post('/', verify, async (req, res) => {
    // Validate favorite submission
    const { error } = validateFavorite(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // assign new favorite Pokemon
    const newFavorite = {name: req.body.name.toLowerCase(), comment: ''}
    
    // Finds the user ID that matches the Token ID
    const user = await User.findOne({_id: req.user})
    
    // Check to see if this favorite is already in object array
    const checkFavorite = await Object.keys(user.favorites).some((key) => {
        if (newFavorite.name === user.favorites[key].name) {
            return true
        }
    })
     if (checkFavorite) return res.status(400).send('This Pokemon is already in your favorites')
    
    // Pushes and Saves the favorite pokemon to the database
    await user.favorites.push(newFavorite)
    await user.save()
    
    // Returns value
    await res.send(user.favorites)
})

router.put('/:name', verify, async (req, res) => {
    // Validate comment submission
    const { error } = validateComment(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    
    // Finds the user, pokemon, and comment
    const user = await User.findOne({_id: req.user})
    const pokemon = await req.params.name.toLowerCase()
    const comment = await req.body.comment
    
    // Check if database contains the selected Pokemon
    const pokemonKeys = await Object.keys(user.favorites).some((key) => {
        if (pokemon === user.favorites[key].name) {
            user.favorites[key].comment = comment
            user.save()
            return true
        }
    })
    if (!pokemonKeys) return res.status(400).send('Pokemon is not a favorite')
    
    // Returns favorites
    await res.send(user.favorites)
})

router.delete('/:name', verify, async (req, res) => {
    // Get user and pokemon name
    const user = await User.findOne({_id: req.user})
    const pokemon = await req.params.name.toLowerCase()
    
    // Check if database contains the selected Pokemon
    const checkPokemon = await Object.keys(user.favorites).some((key) => {
        if (pokemon === user.favorites[key].name) {
            const favorite = user.favorites[key]
            const index = user.favorites.indexOf(favorite)
            user.favorites.splice(index, 1)
            user.save()
            return true
        }
    })
    if (!checkPokemon) return res.status(400).send('Pokemon is not in favorites')
    
    // Return favorites
    await res.send(user.favorites)
})



module.exports = router