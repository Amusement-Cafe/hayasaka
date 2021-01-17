const {model, Schema} = require('mongoose')

module.exports = model('User', {
    discord_id:         { type: String },
    username:           { type: String },
    joined:             { type: Date },
})