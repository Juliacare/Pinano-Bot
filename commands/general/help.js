module.exports.load = (client) => {
    client.commands['help'] = {
        run(message){
            let msg = new client.discord.RichEmbed()
            msg.setTitle('Help')
            msg.setDescription(`Here is a list of all currently available commands.`)
            msg.addField('General Commands', `
            \`${client.settings.prefix}help\` - Get help for the bot!
            \`${client.settings.prefix}time\` - Get your practice stats!
            \`${client.settings.prefix}{leaderboard/lb} {weekly/overall}\` - See the leaderboards!
            `, false)
            msg.setColor(client.settings.embed_color)
            msg.setTimestamp()
            message.author.send(msg)
            message.reply('Sent you the command list.')
            .then(m => {
                setTimeout(() => {
                    m.delete()
                }, 3000)
            })
        }
    }
}