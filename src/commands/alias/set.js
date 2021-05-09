const { writeFile } = require('fs')

const readFile = require('../../utils/read')

let userAliases = JSON.parse(readFile('./src/alias/user.json'))

const fns = {
  account: (message, property, arguments) => {
    if (!userAliases.hasOwnProperty('account'))
        userAliases = { account: {}, ...userAliases }

    const args = parseArguments(property, arguments)

    userAliases.account = { [args.alias]: args.account, ...userAliases.account }

    console.log(userAliases)

    writeFile('./src/alias/user.json', JSON.stringify(userAliases), (error) => {
      if (error)
        message.reply('Setting account alias failed.')

      message.reply(`Alias \`${args.alias}\` for \`${args.account}\` has been added.`)

      return
    })
  }
}

const parseArguments = (property, arguments) => {
  switch (property) {
    case 'account':
      const account = arguments.shift().toUpperCase()
      const alias = arguments.shift()

    return { account, alias }
  }
}

module.exports = (message, arguments) => {
  const property = arguments.shift()

  if (fns.hasOwnProperty(property))
    fns[property](message, property, arguments)
}