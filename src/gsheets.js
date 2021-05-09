const dotenv = require('dotenv')
const { google } = require('googleapis')
const readFile = require('./utils/read')
const readline = require('readline')
const { existsSync, writeFile } = require('fs')

dotenv.config()

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/spreadsheets'
]

const getNewTokenAuthUrl = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      writeFile(process.env.TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', process.env.TOKEN_PATH);
        callback(oAuth2Client)
      });
    });
  });
}

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

module.exports = {
  fetch: (range, callback = () => {}) => sheets.spreadsheets.values.get({
    spreadsheetId: '1w28ghEVMtWHW1D5S1oqeQrSjt4k-JdiWMC2gMTSb6mk',
    range,
  }, (error, response) => {
    callback(error, response)
  }),
  append: (range, values, callback = () => {}) => sheets.spreadsheets.values.append({
    spreadsheetId: '1w28ghEVMtWHW1D5S1oqeQrSjt4k-JdiWMC2gMTSb6mk',
    range,
    insertDataOption: 'OVERWRITE',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [values]
    }
  }, (error, response) => {
    callback(error, response)
  }),
  rowCount: (range, callback = () => {}) => sheets.spreadsheets.values.get({
    spreadsheetId: '1w28ghEVMtWHW1D5S1oqeQrSjt4k-JdiWMC2gMTSb6mk',
    range,
  }, (error, response) => {
    callback(error, response.data.values.length)
  })
}