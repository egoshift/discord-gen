const dotenv = require('dotenv')
const { google } = require('googleapis')
const readFile = require('../utils/read')

dotenv.config()

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/spreadsheets'
]

const oAuth2Client = () => {
  let authClient, clientEmail, privateKey

  if (process.env.NODE_ENV === 'production') {
    clientEmail = process.env.CLIENT_EMAIL
    privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
  } else {
    const serviceAccount = JSON.parse(readFile(process.env.PRIVATE_KEY))

    clientEmail = serviceAccount.client_email
    privateKey = serviceAccount.private_key
  }

  authClient = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    SCOPES
  )

  return authClient
}

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client() })

module.exports = sheets