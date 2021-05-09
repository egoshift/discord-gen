const { DateTime } = require('luxon')

format = date => date.toLocaleString(DateTime.DATE_SHORT)

const aliases = {
  today: format(DateTime.now()),
  yesterday: format(DateTime.now().plus({ days: -1 }))
}

module.exports.parse = alias => {
  console.log(alias)

  if (aliases.hasOwnProperty(alias))
    return aliases[alias]

  return format(alias)
}