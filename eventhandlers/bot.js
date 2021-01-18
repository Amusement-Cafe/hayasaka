const { rct, cmd }  = require('../core')
const sample        = require('lodash.sample')

const init = (ctx) => {
    const bot = ctx.bot

    bot.on('ready', async event => {
        await bot.editStatus('online', { name: 'peasants type', type: 3})
        console.log(`Bot is ready on **${bot.guilds.size} guild(s)** with **${bot.users.size} user(s)** using **${bot.shards.size} shard(s)**`)
    })

    bot.on('messageCreate', async (msg) => {
        if (msg.author.id == bot.user.id)
            return

        const content = msg.content
        const guild = await ctx.modules.guild.fetchOrCreate(ctx, msg.channel.guild.id)
        const user = await ctx.modules.user.fetchOrCreate(ctx, msg.author.id)

        if(!user) return

        const guildUser = ctx.modules.guild.getGuildUser(ctx, guild, user)

        if(!guild.channels.default) {
            guild.channels.default = msg.channel.id
        }

        guildUser.messages++
        await guild.save()

        if (!content.startsWith(ctx.config.prefix))
            return

        if(content.trim() === ctx.config.prefix)
            return ctx.send(msg.channel.id, sample(sample(ctx.data.emotes)))

        const reply = (content) => ctx.sendEmbed(msg.channel.id, ctx.makeEmbed(content, 'default'))
        const err = (content) => ctx.sendEmbed(msg.channel.id, ctx.makeEmbed(content, 'error'))

        const botUser = bot.users.find(x => x.id == msg.author.id)
        const discordGuild = bot.guilds.find(x => x.id == msg.channel.guild.id)
        const discordGuildMember = discordGuild.members.find(x => x.id == user.discord_id)

        const isolatedCtx = Object.assign({}, ctx, {
            msg, guild, botUser, discordGuild, discordGuildMember,
            reply, err,
        })

        if(!(ctx.modules.user.isOwner(isolatedCtx, user) || ctx.modules.user.isModerator(isolatedCtx, user))) {
            const reply = []
            reply.push(`Hayasaka commands are available only for guild owner`)

            if(guild.roles.moderator) {
                reply.push(`or users with role @${discordGuild.roles.find(x => x.id === guild.roles.moderator).name}`)
            }

            return err(reply.join(' '))
        }

        try {
            const args = content.slice(ctx.config.prefix.length, content.length).trim().split(' ')
            await cmd.trigger(isolatedCtx, user, args)
        } catch(e) {
            console.log(e)
        }
    })

    bot.on('messageReactionAdd', async (msg, emoji, userID) => {
        if (userID == bot.user.id)
            return

        const user = bot.users.find(x => x.id == userID)
        try {
            await rct.trigger(ctx, user, msg, emoji.name)
        } catch (e) {
            console.log(e)
        }

        console.log(`[${user.username}]: ${emoji.name}`)
    })

    bot.on('guildMemberAdd', async (discordGuild, discordGuildMember) => {
        const guild = await ctx.modules.guild.fetchOrCreate(ctx, discordGuild.id)
        const user = await ctx.modules.user.fetchOrCreate(ctx, discordGuildMember.id)

        if(!guild.users.some(x => x.id == user.discord_id)) {
            const guildUser = ctx.modules.guild.getGuildUser(ctx, guild, user)
            const amusementUser = await ctx.modules.amusement.getAmusementUser(ctx, discordGuildMember.id)

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
                await discordGuildMember.addRole(guild.roles.verified, `Verified automatically: returning user`)
            }

            if(guild.channels.report) {
                const report = []
                report.push(`User returned - **${discordGuildMember.username}**. Join count: **${guildUser.join_count}**`)

                await ctx.sendEmbed(guild.channels.report, ctx.makeEmbed(report.join('\n'), 'default'))
            }

            if(guild.channels.welcome) {
                const msg = `Welcome back, **${user.username}**!`
                await ctx.sendEmbed(guild.channels.welcome, ctx.makeEmbed(msg, 'default'))
            }
        }

        await guild.save()
    })

    bot.on('disconnect', () => {
        console.log('Bot disconnected')
    })

    bot.on('error', (e) => {
        console.log(e)
    })
}

module.exports = {
    init,
}