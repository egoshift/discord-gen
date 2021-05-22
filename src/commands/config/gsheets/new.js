const GSheetSchema = require('../../../schema/GSheets')
const { validateId } = require('../../../gsheets')
const { set } = require('../../../firestore')

const fns = {
  default: async (message, arguments) => {
    const args = await parseArguments(arguments)

    if (!args.spreadsheetId) return

    const { error, value: GSheets } = GSheetSchema.validate({
      sheets: [ {...args} ],
    })

    if (error) return

    set('gsheets', GSheets)
  }
}

const parseArguments = async (arguments) => {
  const spreadsheetName = arguments.shift()
  const spreadsheetId = await validateId(arguments.shift())

  console.log('dsd', spreadsheetId)

  return {
    spreadsheetName,
    spreadsheetId,
  }
}

module.exports = (message, arguments) => {
  fns.default(message, arguments)
}