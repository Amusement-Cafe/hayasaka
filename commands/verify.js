const guild = require('../collections/guild')
const { cmd }  = require('../core')

cmd.push(['verify'], async (ctx, user, ...args) => {
    const userId = args[0]
    const roleId = ctx.guild.roles.verified

    if(!roleId) {
        return ctx.err(`Verified role wasn't set. Use \`${ctx.config.prefix} set role verified <roleID>\` to set it`)
    }

    if(!userId) {
        return ctx.err(`Usage: \`${ctx.config.prefix} verify <userID>\``)
    }

    const guildMember = (await ctx.discordGuild.fetchMembers({ userIDs: [userId] }))[0]
    if(!guildMember) {
        return ctx.err(`Guild member with ID \`${userId}\` wasn't found.`)
    }

    if(guildMember.roles.includes(roleId)) {
        return ctx.err(`${guildMember.username} is already verified.`)
    }

    await guildMember.addRole(roleId, `Verified by ${user.username}`)

    if(ctx.guild.channels.welcome) {
        const msg = []
        msg.push(`**${guildMember.username}**, welcome to **${ctx.discordGuild.name}**!`)
        msg.push(ctx.guild.messages.welcome)
        await ctx.sendEmbed(ctx.guild.channels.welcome, ctx.makeEmbed(msg.join('\n'), 'default'))
    }

    return ctx.reply(`User **${guildMember.username}** has been verified!`)
})

cmd.push(['unverify'], async (ctx, user, ...args) => {
    const userId = args[0]
    const roleId = ctx.guild.roles.verified

    if(!roleId) {
        return ctx.err(`Verified role wasn't set. Use \`${ctx.config.prefix} set role verified <roleID>\` to set it`)
    }

    if(!userId) {
        return ctx.err(`Usage: \`${ctx.config.prefix} unverify <userID>\``)
    }

    const guildMember = (await ctx.discordGuild.fetchMembers({ userIDs: [userId] }))[0]
    if(!guildMember) {
        return ctx.err(`Guild member with ID \`${userId}\` wasn't found.`)
    }

    if(!guildMember.roles.includes(roleId)) {
        return ctx.err(`${guildMember.username} is not verified.`)
    }

    await guildMember.removeRole(roleId, `Unverified by ${user.username}`)

    return ctx.reply(`User **${guildMember.username}** has been unverified`)
})
