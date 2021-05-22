const joi = require('joi')

module.exports = joi.object({
  discordId: joi.string().required(),
  username: joi.string().alphanum().required(),
  gsheets: joi.boolean().default(false),
  notion: joi.boolean().default(false),
})