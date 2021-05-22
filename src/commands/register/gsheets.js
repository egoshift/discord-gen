const { set } = require('../../firestore')
const UserSchema = require('../../schema/Users')

const fns = {
  default: (message, arguments) => {
    const discordId = message.author.id
    const username = parseArguments.username(arguments.shift(), message.author)

    const { error, value: User } = UserSchema.validate({
      discordId,
      username,
      gsheets: true,
    })

    if (error) return

    set('users', User)
  }
}

const parseArguments = {
  username: (username, author) => /^[a-z][a-z0-9]*$/.test(username) ? username : `${author.username}#${author.discriminator}`
}

module.exports = (message, arguments) => {
  fns.default(message, arguments)
}