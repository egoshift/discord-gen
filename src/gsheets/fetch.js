const sheets = require('./auth')

module.exports = (range, callback = () => {}) => sheets.spreadsheets.values.get({
  spreadsheetId: '1w28ghEVMtWHW1D5S1oqeQrSjt4k-JdiWMC2gMTSb6mk',
  range
}, (error, response) => {
  callback(error, response)
})
