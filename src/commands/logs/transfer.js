const gsheets = require('../../gsheets')
const { DateTime } = require('luxon')

const dateAlias = require('../../alias/date')
const userAlias = require('../../alias/user.json')
const emoji = require('../../config/emojis.config')
const config = require('../../config/logs.config')

const fns = {
  default: (message, arguments) => {
    const args = parseArguments(arguments)

    gsheets.rowCount(config.range, (error, count) => {
      if (error) return

      const row = count + 1

      gsheets.append(config.range, [
        args.date,
        config.formulas.category(row),
        'TRANSFER',
        config.formulas.accountFrom(row),
        args.accountFrom,
        config.formulas.accountTo(row),
        args.accountTo,
        args.particular,
        config.formulas.finalAmount(row),
        config.formulas.finalTransfer(row),
        args.displayAmount,
        args.remarks
      ], (error, response) => {
        if (error) console.log(error)
  
        message.react(emoji.muscle)
      })

    })
  }
}

const parseAccountAlias = account => {
  return userAlias.account.hasOwnProperty(account) ? userAlias.account[account] : account.toUpperCase()
}

const parseArguments = (arguments) => {
  const date = dateAlias.parse(arguments.shift())
  const accountFrom = parseAccountAlias(arguments.shift())
  const accountTo = parseAccountAlias(arguments.shift())
  const particular = arguments.shift().replace(/\-/g, ' ') || ''
  const displayAmount = arguments.shift() || 0
  const remarks = arguments.join(' ') || ''

  return {
    date,
    accountFrom,
    accountTo,
    particular,
    displayAmount,
    remarks,
  }
}

module.exports = (message, arguments) => {
  fns.default(message, arguments)
}