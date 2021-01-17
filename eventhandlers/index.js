module.exports = {
    init: (ctx) => {
        const bot = require('./bot')
        const mongoose = require('./mongoose')

        bot.init(ctx)
        mongoose.init(ctx)
    }
}