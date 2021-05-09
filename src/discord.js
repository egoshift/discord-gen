const dotenv = require('dotenv')
const { Client } = require('discord.js')

dotenv.config()

const client = new Client()

const login = () => {
  client.login(process.env.DISCORD_TOKEN)
}

module.exports = {
  client,
  login
}