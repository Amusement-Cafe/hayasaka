const { rct, cmd }  = require('../core')

cmd.push(['confused'], async (ctx, user) => {
    await ctx.send(ctx.msg.channel.id, sample(emotes.confused))
    return ctx.bot.deleteMessage(ctx.msg.channel.id, ctx.msg.id)
})