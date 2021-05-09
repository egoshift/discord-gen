const discord = require('./discord')
const dotenv = require('dotenv')

const commandHandler = require('./commands')

dotenv.config()

// TODO:
// Add callback here
discord.login()

discord.client.on('ready', () => {
  console.log('Bot is ready.')
})

discord.client.on('message', commandHandler)
