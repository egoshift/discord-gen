const firestore = require('../../firestore')

const fns = {
  default: (message, arguments) => {
    const discordId = message.author.id
    const username = parseArguments.username(arguments.shift())

    firestore.set('users', {
      discordId,
      username,
      gsheets: true,
    })
  }
}

const parseArguments = {
  username: (username) => /^[a-z][a-z0-9]*$/.test(username) ? username : ''
}

module.exports = (message, arguments) => {
  fns.default(message, arguments)
}