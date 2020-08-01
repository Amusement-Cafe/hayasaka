const Eris          = require('eris')
const mongoose      = require('mongoose')
const sample        = require('lodash.sample')

const emotes        = require('./data/emotes')
const { rct, cmd }  = require('./core')
const commands      = require('./commands')

const {
    token, shards, mongoUri
} = require('./config')

const create = async () => {
    const mongoOpt = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }

    const defaultEmbed = {
        color: 7121879,
        description: ``,
    }

    const bot = new Eris(token, { maxShards: shards })
    //const mcn = await mongoose.connect(mongoUri, mongoOpt)
    const send = (ch, content) => {
        if(typeof content === 'object') {
            bot.createMessage(ch, { embed: content })
        } else {
            bot.createMessage(ch, { embed: Object.assign({}, defaultEmbed, {
                description: content,
            })})
        }
    } 
    const err = (ch, msg) => bot.createMessage(ch, { embed: { description: msg, color: 16329259 } })

    const ctx = {
        bot, send, err, defaultEmbed
    }

    bot.connect()

    mongoose.connection.on('error', err => {
        console.log(err)
    })

    bot.on('ready', async event => {
        await bot.editStatus('online', { name: 'peasants type', type: 3})
        console.log(`Bot is ready on **${bot.guilds.size} guild(s)** with **${bot.users.size} user(s)** using **${bot.shards.size} shard(s)**`)
    })

    bot.on('messageCreate', async (msg) => {
        const content = msg.content.toLowerCase()
        if (msg.author.id == bot.user.id || !content.startsWith('hayy'))
            return

        if(content.trim() === 'hayy')
            return send(msg.channel.id, sample(sample(emotes)))

        const user = bot.users.find(x => x.id == msg.author.id)
        try {

            const args = content.slice(4, content.length).trim().split(' ')
            const isolatedCtx = Object.assign({}, ctx, {
                msg,
            })

            await cmd.trigger(isolatedCtx, user, args)
        } catch(e) {
            console.log(e)
        }

        console.log(`[${msg.author.username}]: ${content}`)
    })

    bot.on('messageReactionAdd', async (msg, emoji, userID) => {
        if (userID == bot.user.id)
            return

        const user = bot.users.find(x => x.id == userID)
        try {
            await rct.trigger(ctx, user, msg, emoji.name)
        } catch (e) {
            console.log(e)
        }

        console.log(`[${user.username}]: ${emoji.name}`)
    })

    bot.on('disconnect', () => {
        console.log('Bot disconnected')
    })

    bot.on('error', (e) => {
        console.log(e)
    })
}

create()
