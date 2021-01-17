const {model, Schema} = require('mongoose')

module.exports = model('Guild', {
    id:             { type: String },
    created:        { type: Date },

    channels:       {
                        report: String,
                        welcome: String,
                        default: String,
                    },

    roles:          {
                        validated: String,
                        moderator: String,
                    },

    users:          [{
                        id: String,
                        messages: Number,
                        joined: Date,
                        join_count: Number,
                    }]
})