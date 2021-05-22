const joi = require('joi')

module.exports = joi.object({
  sheets: joi.array().items(joi.object({
    spreadsheetName: joi.string().default(''),
    spreadsheetId: joi.string().required(),
  })),
  config: joi.object().default({})
})