const { readdirSync } = require('fs')
const { basename, extname } = require('path')

let commands = {}

readdirSync('./src/commands/config/gsheets').forEach(file => {
  if (file === basename(module.filename)) return

  const extension = extname(file)
  const fileName = basename(file, extension)
  const commandObject = { [fileName]: require(`./${fileName}`) }

  Object.assign(commands, commandObject)
})

module.exports = (message, arguments) => {
  const command = arguments.shift()

  if (commands.hasOwnProperty(command))
    commands[command](message, arguments)
}