const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDgxNDBjNTc3OGQxYzEzMTU1NjExMDkiLCJpYXQiOjE1Njg3NTE4NzJ9.ptcX88k1JL5a-yCu7DI34qAwOQtYocj-zOoF7-ASJwk'

// Search call for a Pokemon
const searchPokemon = async (pokemon) => {
    const api = (`http://localhost:3000/api/pokemon/${pokemon}`)
    try{
        const response = await fetch (api)
        if (!response.ok) throw new Error(response.statusText)
        const json = await response.json()
        return json
    } catch (err) {
        alert('Not a Pokemon. Please enter a valid Pokemon')
    }
}

// Load current users favorites to screen
const loadFavorites = async () => {
    const api = ('http://localhost:3000/api/favorites')
    try {
        const response = await fetch (api, {
            headers: {
                'auth-token': token
            }
        })
        if (!response.ok) throw new Error(response.statusText)
        const json = await response.json()
        return json
    } catch (err) {
        alert('Invalid Loading')
    }
}

// Adds a new favorite
const addFavorite = async (pokemon) => {
    const api = ('http://localhost:3000/api/favorites')
    try {
        const response = await fetch (api, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({name: pokemon})
        })
        if (!response.ok) throw new Error(response.statusText)
        const content = await response.json()
    } catch (err) {
        alert('Pokemon already a favorite')
    }
    
}

// Deletes favorite
const deleteFavorite = async (pokemon) => {
    const api = (`http://localhost:3000/api/favorites/${pokemon}`)
    try {
        const response = await fetch (api, {
            method: 'DELETE',
            headers: {
                'auth-token': token
            }
        })
        if (!response.ok) throw new Error(response.statusText)
        const content = await response.json()
    } catch (err) {
        alert('Pokemon not found in favorites')
    }
    
}
// Update Comment
const updateComment = async (pokemon, comment) => {
    const api = (`http://localhost:3000/api/favorites/${pokemon}`)
    try {
        const response = await fetch (api, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({comment: comment})
        })
        if (!response.ok) throw new Error(response.statusText)
        const content = await response.json()
    } catch (err) {
        alert('Pokemon not found')
    }
}

const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('searchText')
const searchResults = document.getElementById('search-results')

searchForm.addEventListener('submit', e => {
    e.preventDefault()
    
    // Clear all search results before new search
    searchResults.innerHTML = ''
    const pokemon = searchInput.value 
    searchInput.value = ''
    
    // Perform Search
    searchPokemon(pokemon)
        .then(results => {
        
        const name = results.name
        const pic = results.sprites.back_default
        const types = results.types
        const pokedexNum = results.id
        let typeNames = ''
        if (types.length === 2) {
            typeNames = `${types[1].type.name} / ${types[0].type.name}`
        } else {
            typeNames = `${types[0].type.name}`
        }
        
        // create search item
        const pokemonElement = document.createElement('div')
        
        // Load info and assign to element
        const pokemonInfo = `${pokedexNum} ${name} ${typeNames}`
        // Add Info to results
        pokemonElement.innerHTML = pokemonInfo
        searchResults.appendChild(pokemonElement)
        
        // Setup favorite button
        const favoriteButton = document.createElement('button')
        favoriteButton.textContent = 'Add to Favorites'
        pokemonElement.appendChild(favoriteButton)
        // Functionality of Button
        favoriteButton.addEventListener('click', async () => {
            // add favorite function
            await addFavorite(name)
            await renderFavorites()
        })
    })
})

// Renders the current Users favorites to the screen
const renderFavorites = async () => {
    
    const favorites = await document.getElementById('favorites')
    favorites.innerHTML = ''
    // Call Load function
    await loadFavorites()
        .then(results => {
            results.forEach(pokemon => {
                const favoriteElement = generateFavorite(pokemon)
                favorites.appendChild(favoriteElement)
            })
        })
}

// Generates a Favorite 
const generateFavorite = (favorite) => {
    const container = document.createElement('div')
    const nameEl = document.createElement('h3')
    const commentEl = document.createElement('p')
    const removeButton = document.createElement('button')
    const commentForm = document.createElement('form')
    const commentInput = document.createElement('input')
    const button = document.createElement('input')
    
    // Create name for pokemon
    nameEl.textContent = favorite.name
    container.appendChild(nameEl)
    
    // Create Comment
    commentEl.textContent = favorite.comment
    container.appendChild(commentEl)
    
    // Remove from favorites
    removeButton.textContent = 'Remove'
    container.appendChild(removeButton)
    removeButton.addEventListener('click', async () => {
        // Call Delete
        await deleteFavorite(favorite.name)
        await renderFavorites()
    })
    
    commentForm.addEventListener('submit', async e => {
        await e.preventDefault()
        
        // Update Comment
        await updateComment(favorite.name, commentInput.value)
        await renderFavorites()
        
    })
    
    // Comment input and submission setup
    commentInput.setAttribute('id', 'comment-input')
    button.setAttribute('id', 'comment-submit')
    button.setAttribute('type', 'submit')
    
    // Adding comment form to container
    commentForm.appendChild(commentInput)
    commentForm.appendChild(button)
    container.appendChild(commentForm)
    
    
    return container
}

renderFavorites()