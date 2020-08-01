const {model, Schema} = require('mongoose')

module.exports = model('User', {
    discord_id:         { type: String },
    joined:             { type: Date },
    joincount:          { type: Number, default: 1}
})