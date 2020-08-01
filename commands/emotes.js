const { rct, cmd }  = require('../core')
const sample        = require('lodash.sample')
const emotes        = require('../data/emotes') 

cmd.push(['confused'], async (ctx, user) => {
    await ctx.send(ctx.msg.channel.id, sample(emotes.confused))
    return ctx.bot.deleteMessage(ctx.msg.channel.id, ctx.msg.id)
})

cmd.push(['meh'], async (ctx, user) => {
    await ctx.send(ctx.msg.channel.id, sample(emotes.meh))
    return ctx.bot.deleteMessage(ctx.msg.channel.id, ctx.msg.id)
})

cmd.push(['doubt'], ['hmm'], async (ctx, user) => {
    await ctx.send(ctx.msg.channel.id, sample(emotes.doubt))
    return ctx.bot.deleteMessage(ctx.msg.channel.id, ctx.msg.id)
})

cmd.push(['wow'], async (ctx, user) => {
    await ctx.send(ctx.msg.channel.id, sample(emotes.wow))
    return ctx.bot.deleteMessage(ctx.msg.channel.id, ctx.msg.id)
})
