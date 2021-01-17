const Guild     = require('../collections/guild')

const fetchOrCreate = async (ctx, guildId) => {
    let guild = await Guild.findOne({ id: guildId })

    if (!guild) {
        guild = new Guild()
        guild.id = guildId
        guild.created = new Date()

        await guild.save()
    }

    return guild
}

const getGuildUser = (ctx, guild, user) => {
    let guildUser = guild.users.find(x => x.id == user.discord_id)
    if(!guildUser) {
        guildUser = {
            id: user.discord_id,
            messages: 0,
            joined: new Date(),
            join_count: 1,
        }

        guild.users.push(guildUser)
    }

    return guildUser
}

module.exports = {
    fetchOrCreate,
    getGuildUser,
}