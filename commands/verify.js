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
    return ctx.reply(`User **${guildMember.username}** has been verified!`)

})