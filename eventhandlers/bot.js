const { rct, cmd }  = require('../core')
const sample        = require('lodash.sample')

const init = (ctx) => {
    const bot = ctx.bot

    bot.on('ready', async event => {
        await bot.editStatus('online', { name: 'peasants type', type: 3})
        console.log(`Bot is ready on **${bot.guilds.size} guild(s)** with **${bot.users.size} user(s)** using **${bot.shards.size} shard(s)**`)
    })

    bot.on('messageCreate', async (msg) => {
        if (msg.author.id == bot.user.id)
            return

        const content = msg.content.toLowerCase()
        const guild = await ctx.modules.guild.fetchOrCreate(ctx, msg.channel.guild.id)
        const user = await ctx.modules.user.fetchOrCreate(ctx, msg.author.id)

        if (!content.startsWith(ctx.config.prefix))
            return

        if(content.trim() === ctx.config.prefix)
            return ctx.send(msg.channel.id, sample(sample(ctx.data.emotes)))

        const botUser = bot.users.find(x => x.id == msg.author.id)
        const discordGuild = bot.guilds.find(x => x.id == msg.channel.guild.id)

        const reply = (content) => ctx.sendEmbed(msg.channel.id, ctx.makeEmbed(content, 'default'))
        const err = (content) => ctx.sendEmbed(msg.channel.id, ctx.makeEmbed(content, 'error'))
        
        const isolatedCtx = Object.assign({}, ctx, {
            msg, guild, botUser, discordGuild,
            reply, err,
        })

        try {

            const args = content.slice(ctx.config.prefix.length, content.length).trim().split(' ')
            await cmd.trigger(isolatedCtx, user, args)

        } catch(e) {
            console.log(e)
        }

        //console.log(`[${msg.author.username}]: ${content}`)
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

    bot.on('guildMemberAdd', async () => {
        let user = bot.users[member.id]

        let ayyDBUser = await ayymembers.findOne({discord_id: member.id})
        let acDBUser = await ucollection.findOne({discord_id: member.id})
        let msg = ""

        if(ayyDBUser) {
            msg += `Welcome back, **${user.username}**`
            ayymembers.update({discord_id: member.id}, {$inc: {joinCount: 1}})
        } else {
            msg += `Welcome, <@${user.id}>`
            if(!acDBUser) {
                msg += "\nPlease read <#475932375499538435>"
                msg += "\nAlso here is your :doughnut:\nJoin **Amusement Club** gacha! Get started with `->claim` in <#351871635424542731> !"
            } else {
                if(acDBUser.hero) msg += ` and **${acDBUser.hero.name}** (level ${heroes.getHeroLevel(acDBUser.hero.exp)})!`
                msg += "\nPlease read <#475932375499538435>"
                msg += "\nYou can ask bot related questions in <#370742439679492096>\nTrade your cards in <#351957621437235200>"
            }
            //addNewUser(user);
        }

        //sendMessage(settings.mainchannel, msg);
    })

    bot.on('disconnect', () => {
        console.log('Bot disconnected')
    })

    bot.on('error', (e) => {
        console.log(e)
    })
}

module.exports = {
    init,
}