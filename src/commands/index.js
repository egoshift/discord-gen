const { lstatSync, readdirSync } = require('fs')
const { basename } = require('path')

let commands = {}

readdirSync('./src/commands').forEach(file => {

  if (file === basename(module.filename)) return

  if (lstatSync(`./src/commands/${file}`).isDirectory()) {
    const commandObject = { [file]: require(`./${file}/index`) }
    Object.assign(commands, commandObject)
  } else {
    Object.assign(commands, require(`./${file}`))
  }

})

module.exports = (message) => {

  const commandArray = message.content.split(/[ ]+/)
  const command = commandArray.shift()

  if (commands.hasOwnProperty(command))
    commands[command](message, commandArray)

}