const { cmd }  = require('../core')

cmd.push(['set', 'channel'], async (ctx, user, ...args) => {
    const channelType = args[0]
    const channelId = args[1]
    const possibleTypes = Object.keys(ctx.guild.channels).filter(x => !x.startsWith('$'))

    if(!channelType || !channelId) {
        return ctx.err(`Usage: \`${ctx.config.prefix} set channel [${possibleTypes.join(' | ')}] <channelID>\``)
    }

    if(!ctx.discordGuild.channels.some(x => x.id === channelId)) {
        return ctx.err(`Channel with ID \`${channelId}\` wasn't found.`)
    }

    if(!possibleTypes.includes(channelType)) {
        return ctx.err(`Cannot set channel to **${channelType}**. 
            Possible types: ${possibleTypes.join(' | ')}`)
    }

    ctx.guild.channels[channelType] = channelId
    await ctx.guild.save()
    return ctx.reply(`Set <#${channelId}> as **${channelType}** channel`)

})

cmd.push(['set', 'message'], async (ctx, user, ...args) => {
    const messageType = args.shift()
    const message = args.join(' ')
    const possibleTypes = Object.keys(ctx.guild.messages).filter(x => !x.startsWith('$'))

    if(!messageType || !message) {
        return ctx.err(`Usage: \`${ctx.config.prefix} set message [${possibleTypes.join(' | ')}] <message>\``)
    }

    if(!possibleTypes.includes(messageType)) {
        return ctx.err(`Cannot set message to **${messageType}**. 
            Possible types: ${possibleTypes.join(' | ')}`)
    }

    ctx.guild.messages[messageType] = message
    await ctx.guild.save()
    return ctx.reply(`Set **${messageType}** message to
        >>> ${message}`)

})

cmd.push(['set', 'role'], async (ctx, user, ...args) => {
    const roleType = args[0]
    const roleId = args[1]
    const possibleTypes = Object.keys(ctx.guild.roles).filter(x => !x.startsWith('$'))

    if(!roleType || !roleId) {
        return ctx.err(`Usage: \`${ctx.config.prefix} set role [${possibleTypes.join(' | ')}] <roleID>\``)
    }

    const guildRole = ctx.discordGuild.roles.find(x => x.id === roleId)
    if(!guildRole) {
        return ctx.err(`Role with ID \`${roleId}\` wasn't found.`)
    }

    if(!possibleTypes.includes(roleType)) {
        return ctx.err(`Cannot set role to **${roleType}**. 
            Possible types: ${possibleTypes.join(' | ')}`)
    }

    ctx.guild.roles[roleType] = roleId
    await ctx.guild.save()
    return ctx.reply(`Set \`@${guildRole.name}\` as **${roleType}** role`)

})