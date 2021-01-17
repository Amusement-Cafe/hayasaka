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

module.exports = {
    fetchOrCreate,
}