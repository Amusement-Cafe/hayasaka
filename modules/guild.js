const Guild     = require('../collections/guild')

const fetchOrCreate = async (ctx, guildId) => {
    let guild = await Guild.findOne({ id: guildId })

    const discordGuild = ctx.bot.guilds[guildId]
    console.log(discordGuild)

    if (!guild) {
        guild = new Guild()
        guild.id = guildId
        guild.created = new Date()

        await guild.save()
    }

    return guild
}

module.exports = {
    fetchOrCreate,
}