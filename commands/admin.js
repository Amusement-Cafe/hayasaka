const { rct, cmd }  = require('../core')

cmd.push(['test'], async (ctx, userarg) => {
    const bot = ctx.bot
    const discordGuild = bot.guilds.find(x => x.id == ctx.msg.channel.guild.id)
    const discordGuildMember = discordGuild.members.find(x => x.id === userarg.discord_id)

    ////---------------////
    const guild = await ctx.modules.guild.fetchOrCreate(ctx, discordGuild.id)
    const user = await ctx.modules.user.fetchOrCreate(ctx, discordGuildMember.id)

    console.log(guild.users)
    if(!guild.users.some(x => x.id == user.discord_id)) {
        const guildUser = ctx.modules.guild.getGuildUser(ctx, guild, user)
        const amusementUser = await ctx.modules.amusement.getAmusementUser(ctx)

        if(guild.channels.report) {
            const report = []
            report.push(`New user joined - **${user.username}**`)
            report.push(`Is Amusement member: **${amusementUser != undefined}**`)

            if(guild.channels.screen && !amusementUser) {
                report.push(`This user is awaiting verification. Use \`${ctx.config.prefix} verify ${user.discord_id}\` to verify.`)
            }

            await ctx.sendEmbed(guild.channels.report, ctx.makeEmbed(report.join('\n'), 'default'))
        }

        let channel = guild.channels.default
        const msg = []
        msg.push(`**${user.username}**, welcome to **${discordGuild.name}**!`)

        if(guild.channels.screen && !amusementUser) {
            msg.push(guild.messages.screen)
            channel = guild.channels.screen
        } else if(guild.channels.welcome) {
            msg.push(guild.messages.welcome)
            channel = guild.channels.welcome

            if(guild.roles.verified) {
                await discordGuildMember.addRole(guild.roles.verified)
            }
        }

        await ctx.sendEmbed(channel, ctx.makeEmbed(msg.join('\n'), 'default'))

    } else {
        const guildUser = ctx.modules.guild.getGuildUser(ctx, guild, user)
        guildUser.join_count++

        if(guild.roles.verified) {
            await discordGuildMember.addRole(guild.roles.verified)
        }

        if(guild.channels.welcome) {
            const msg = `Welcome back, **${user.username}**!`
            await ctx.sendEmbed(guild.channels.welcome, ctx.makeEmbed(msg, 'default'))
        }
    }

    await guild.save()
})