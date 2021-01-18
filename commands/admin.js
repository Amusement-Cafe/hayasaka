const { rct, cmd }  = require('../core')
const pick          = require('lodash.pick')

cmd.push(['test'], async (ctx, user, ...args) => {
    //const bot = ctx.bot
    //const discordGuild = bot.guilds.find(x => x.id == ctx.msg.channel.guild.id)
    //const discordGuildMember = (await ctx.discordGuild.fetchMembers({ userIDs: [userarg.discord_id] }))[0]

    ////---------------////
    const amusementUser = await ctx.modules.amusement.getAmusementUser(ctx, args[0])
    const values = pick(amusementUser, ['_id', 'discord_id', 'username', 'xp', 'lastdaily', 'joined'])
    ctx.reply(JSON.stringify(values, null, 2).replace(/\"/g, '').substring(0, 2000))
})