const {model, Schema} = require('mongoose')

module.exports = model('Guild', {
    id:             { type: String },
    created:        { type: Date },

    channels:       {
                        report: { type: String, default: '' },
                        welcome: { type: String, default: '' },
                        screen: { type: String, default: '' },
                        default: { type: String, default: '' },
                    },

    messages:       {
                        welcome: { type: String, default: '' },
                        screen: { type: String, default: '' },
                    },

    roles:          {
                        verified: { type: String, default: '' },
                        moderator: { type: String, default: '' },
                    },

    users:          [{
                        id: String,
                        messages: Number,
                        joined: Date,
                        join_count: Number,
                    }]
})