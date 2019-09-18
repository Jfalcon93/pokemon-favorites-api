//Validation
const Joi = require('joi')

// Register Validation
const registerValidation = (data) => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema)
}

const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema)
}

const validateFavorite = (data) => {
    const schema = {
        name: Joi.string().required()
    }
    return Joi.validate(data, schema)
}

const validateComment = (data) => {
    const schema = {
        comment: Joi.string().min(1).required()
    }
    return Joi.validate(data, schema)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.validateFavorite = validateFavorite
module.exports.validateComment = validateComment