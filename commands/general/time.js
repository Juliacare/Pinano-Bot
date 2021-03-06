module.exports.load = (client) => {
    client.commands['time'] = {
        run(message){
            client.loadUserData(message.author.id, res => {
                if(res == null){client.errorMessage(message, "Error fetching your data from our servers, please try again."); return}
                let msg = new client.discord.RichEmbed()
                msg.setAuthor(`${message.author.username}#${message.author.discriminator}'s practice time stats`)
                msg.addField('Weekly Practice Time', `\`${client.hd(res.current_session_playtime * 1000, { units: ['h', 'm', 's'] })}\``, false)
                msg.addField('Overall Practice Time', `\`${client.hd(res.overall_session_playtime * 1000, { units: ['h', 'm', 's'] })}\``, false)
                msg.setColor(client.settings.embed_color)
                msg.setTimestamp()
                client.fetchWeeklyLeaderboardPos(message, pos => {
                    msg.setDescription(`Your weekly rank is ${pos}`)
                    message.channel.send(msg)
                    .then(m => {
                        setTimeout(()=>{
                            m.delete()
                        }, client.settings.res_destruct_time * 1000)
                    })
                })
            })
        }
    }
}
