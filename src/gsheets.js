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
  let authClient

  if (process.env.NODE_ENV === 'production') {
    authClient = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
  } else {
    const credentials = JSON.parse(readFile(process.env.CLIENT_SECRET))
    const { client_id, client_secret, redirect_uris } = credentials.installed

    authClient = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  }

  if (!existsSync(process.env.TOKEN_PATH)) {
    getNewTokenAuthUrl(authClient, () => {
      authClient.setCredentials(JSON.parse(readFile(process.env.TOKEN_PATH)))
    })
  } else {
    authClient.setCredentials(JSON.parse(readFile(process.env.TOKEN_PATH)))
  }

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