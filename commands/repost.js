const { rct, cmd }  = require('../core')
const { repost }    = require('../modules')

rct.push(['🔁'], async (ctx, user, msg) => {
    const message = await ctx.bot.getMessage(msg.channel.id, msg.id)
    return repost.message(ctx, user, message)
})

cmd.push(['repost'], async (ctx, user, ...args) => {
    const chIDstr = args.find(x => x.startsWith('<#'))
    const msgID = args.find(x => !isNaN(x))

    if(!chIDstr || !msgID) {
        return ctx.err(ctx.msg.channel.id, `Format: \`hayy repost [message ID] #channel\``)
    }

    const chID = chIDstr.slice(2, chIDstr.length - 1)
    try {
        const message = await ctx.bot.getMessage(chID, msgID)
        await repost.message(ctx, user, message)
    } catch (e) {
        return ctx.err(ctx.msg.channel.id, `Cannot find message \`${msgID}\` in channel <#${chID}>`)
    }

    return ctx.bot.deleteMessage(ctx.msg.channel.id, ctx.msg.id)
})
