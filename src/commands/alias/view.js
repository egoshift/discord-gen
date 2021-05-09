const { EOL } = require('os')

const readFile = require('../../utils/read')

const userAliases = JSON.parse(readFile('./src/alias/user.json'))

const fns = {
  account: (message) => {
    if (!userAliases.hasOwnProperty('account'))
      userAliases = { account: {}, ...userAliases }

    const accounts = []

    accounts.push('>>> Here are you account aliases: ')
    accounts.push('')

    for (const alias in userAliases.account)
      accounts.push(`**${alias}** - \`${userAliases.account[alias]}\``)

    message.channel.send(accounts.join(EOL))
  }
}

module.exports = (message, arguments) => {
  const property = arguments.shift()

  if (fns.hasOwnProperty(property))
    fns[property](message)
}