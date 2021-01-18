const User      = require('../collections/user')

const fetchOrCreate = async (ctx, userid) => {
    let user = await User.findOne({ discord_id: userid })
    const botUser = ctx.bot.users.find(x => x.id == userid)

    if(!botUser) return

    if (!user) {
        user = new User()
        user.username = botUser.username
        user.discord_id = userid
        user.joined = new Date()

        await user.save()
    }

    if(user.username != botUser.username) {
        user.username = botUser.username
        await user.save()
    }

    return user
}

const isOwner = (ctx, user) => {
    return ctx.discordGuild.ownerID === user.discord_id
}

const isModerator = (ctx, user) => {
    return ctx.discordGuildMember.roles.includes(ctx.guild.roles.moderator)
}

module.exports = {
    fetchOrCreate,
    isOwner,
    isModerator,
}