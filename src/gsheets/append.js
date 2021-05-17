const sheets = require('./auth')

module.exports = (range, values, callback = () => {}) => sheets.spreadsheets.values.append({
  spreadsheetId: '1w28ghEVMtWHW1D5S1oqeQrSjt4k-JdiWMC2gMTSb6mk',
  range,
  insertDataOption: 'OVERWRITE',
  valueInputOption: 'USER_ENTERED',
  resource: {
    values: [values]
  }
}, (error, response) => {
  callback(error, response)
})