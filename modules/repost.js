
const message = async (ctx, user, msg, channel) => {
    const originalLink = `https://discordapp.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`
    const emb = {
        color: 7121879,
        description: `${msg.content} \n\n[Original Message](${originalLink})`,
        author: {
            name: `${msg.author.username} 🔁 ${user.username}`,
            icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        },

        footer: {
            text: (new Date(msg.timestamp)).toLocaleString()
        }
    }
    //

    if(msg.attachments.length > 0) {
        console.log(msg.attachments[0].url)
        emb.image = { url: msg.attachments[0].url }

    } else if(msg.embeds.length > 0) {
        emb.image = msg.embeds[0].image;
        emb.description = msg.embeds[0].description;
    }

    return ctx.sendEmbed(channel || msg.channel.id, emb)
}

module.exports = { 
    message
}
