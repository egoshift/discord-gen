const sheets = require('./auth')

function getSpreadsheet(spreadsheetId) {
  return sheets.spreadsheets.get({
    spreadsheetId,
  })
}

module.exports = async (spreadsheetId) => {
  const response = await getSpreadsheet(spreadsheetId)

  return response.status === 200 ? spreadsheetId : false
}