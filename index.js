const Eris          = require('eris')
const mongoose      = require('mongoose')

const data          = require('./data')
const modules       = require('./modules')
const config        = require('./config') 
const handlers      = require('./eventhandlers')

const create = async () => {

    const mcn = await mongoose.connect(config.mongoUri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false 
    })

    const bot = new Eris(config.token, { maxShards: config.shards })
    const send = (ch, content) => bot.createMessage(ch, content)
    const sendEmbed = (ch, embed) => bot.createMessage(ch, { embed })

    const ctx = {
        bot, modules, mcn, data,
        send, sendEmbed,
    }

    handlers.init(ctx)
    bot.connect()

    require('./commands')
}

create()
