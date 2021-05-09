const { DateTime } = require('luxon')
const { EOL } = require('os')
const asciitable = require('ascii-table')

const gsheets = require('../../gsheets')

const config = require('../../config/logs.config')
const formatNumber = require('../../utils/formatNumber')

const dateToday = DateTime.now().toLocaleString(DateTime.DATE_SHORT)

const fns = {
  default: (message) => {
    gsheets.fetch(config.range, (error, response) => {
      if (error) console.log(error)
  
      const rows = response.data.values
      const resultList = []
  
      console.log(rows.length)
      if (rows.length && rows.length > 0) {
        const table = new asciitable()
        let total = 0

        table
          .setHeading('Category', 'Account', '', 'Particular', 'Amount', 'Remarks')

        rows.map((row) => {
          if (row[config.columns.date] == dateToday) {
            table.addRow(
              row[config.columns.category],
              row[config.columns.fromAccount],
              row[config.columns.toAccount],
              row[config.columns.particular],
              row[config.columns.displayAmount],
              row[config.columns.remarks]
            )
            total += parseFloat(row[config.columns.displayAmount])
          }
        })

        if (total > 0) {
          resultList.push(`>>> Here are your expenses for today: \`${formatNumber(total)}\``)
          resultList.push(`\`\`\`${table.toString()}\`\`\``)  
        } else {
          resultList.push('>>> No logged expenses yet. Nice!')
        }
  
        message.channel.send(resultList.join(EOL))
      } else {
        resultList.push('No logged expenses yet.')
        message.channel.send(resultList.join(EOL))
      }
    })
  },
  total: (message) => {
    gsheets.fetch(config.range, (error, response) => {
      if (error) console.log(error)
  
      const rows = response.data.values
      const resultList = []
      let total = 0
  
      if (rows.length && rows.length > 0) {
        resultList.push('>>> Your total expenses for today:')
        
        rows.map((row) => {
          if (row[config.columns.date] == dateToday)
            total += parseFloat(row[config.columns.displayAmount])
        })

      }

      resultList.push(`|| \`${formatNumber(total)}\` ||`)
  
      message.channel.send(resultList.join(EOL))
    })
  }
}

module.exports = (message, arguments) => {
  if (arguments.length === 0) {
    fns.default(message)
    return
  }

  const fn = arguments.shift()

  if (fns.hasOwnProperty(fn))
    fns[fn](message, ...arguments)
}