module.exports = client => {

    //client bootup 
    client.on('ready', async () => {
        await client.log('Successfully connected to discord.')
        await client.user.setActivity(client.settings.activity, { type: 'Playing' }).catch(e => client.cannon.fire('Could not set activity.'))
        await client.log(`Successfully set activity to ${client.settings.activity}`)
        await client.loadCommands(() => client.log(`Successfully loaded commands!`))
        await client.connectDB(db => {
            client.log(`Connected Database`)
            require('./leaderboard_fetch.js')(client, db)
            client.log(`loaded leaderboard library`)
        })
    })

    //on each message
    client.on('message', async message => {
        await client.loadUserData(message.author.id, res => {
           if(res == null){
               let user = {
                   "id" : message.author.id,
                   "current_session_playtime" : 0,
                   "overall_session_playtime" : 0
               }
               client.writeUserData(message.author.id, user, () => {
                   client.log(`User created for ${message.author.username}#${message.author.discriminator}`)
               })
           }
        })
        message.content = message.content.toLowerCase()
        if(client.isValidCommand(message) == false) return
        if(client.commandExist(message) == false) return
        if(!client.settings.pinano_guilds.includes(message.guild.id)) return client.errorMessage(message, 'This bot can only be used on official Pinano servers.')
        await client.commands[message.content.split(' ')[0].replace(client.settings.prefix, '')].run(message)
        await setTimeout(() => {
            message.delete()
        }, client.settings.req_destruct_time * 1000)
    })

    client.on('voiceStateUpdate', async (oldMember, newMember) => {
        if(!client.settings.pinano_guilds.includes(newMember.guild.id)) return

        //Time handler
        client.loadUserData(newMember.user.id, res => {

            //if the user dosnt exist create a user for the person
            if(res == null){
                let user = {
                    "id" : newMember.user.id,
                    "current_session_playtime" : 0,
                    "overall_session_playtime" : 0
                }
                client.writeUserData(newMember.user.id, user, () => {
                    client.log(`User created for ${newMember.user.username}#${newMember.user.discriminator}`)
                })

            } else {

                client.loadGuildData(newMember.guild.id, restwo => {
                    if(restwo == null){
                        client.createGuild(message.guild.id)
                        client.log('Created new guild.')
                        return
                    } else {
                        //if they are unmuted and a start time dosnt exist and they are in a good channel
                        if(newMember.selfMute == false && newMember.serverMute == false && oldMember.s_time == null && restwo.permitted_channels.includes(newMember.voiceChannelID)){
                            newMember.s_time = client.moment().unix()
                        }

                        //if a start time exist transfer it to new user object
                        else if(oldMember.s_time != null){
                            newMember.s_time == oldMember.s_time
                        }

                        //if user gets muted or leaves or transfers to a bad channel
                        if(newMember.voiceChannelID == null || !restwo.permitted_channels.includes(newMember.voiceChannelID) || newMember.selfMute == true || newMember.serverMute == true){
                            if(newMember.s_time == null) return

                            res.current_session_playtime += client.moment().unix() - newMember.s_time
                            res.overall_session_playtime += client.moment().unix() - newMember.s_time

                            client.writeUserData(newMember.user.id, res, () => {
                                client.log(`User ${newMember.user.username}#${newMember.user.discriminator} practiced for ${client.moment().unix() - newMember.s_time} seconds`)
                                newMember.s_time = null
                                oldMember.s_time = null
                            })
                        }
                    }
                })


            }
         })

        
    })
}