const router = require('express').Router()
const fetch = require('node-fetch')

router.get('/:name', async (req, res) => {
    // Convert to lowercase
    const params = req.params.name.toLowerCase()
    
    // Pokemon API URL
    const url = `https://pokeapi.co/api/v2/pokemon/${params}`
    
    // Call to API
    await fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(json => res.send(json))
        .catch(error => res.send('No Results match'))
})

// Error check for response from Pokemon API    
function checkStatus(res) {
    if (!res.ok) {
        throw Error(res.statusText)
    } else {
        return res
    }
}

module.exports = router