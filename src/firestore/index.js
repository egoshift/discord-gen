const dotenv = require('dotenv')
const firestore = require('firebase-admin')

const set = require('./set')

dotenv.config()

firestore.initializeApp({
  credential: firestore.credential.cert(process.env.CREDENTIALS)
})

module.exports = {
  set: (collection, data) => set(firestore.firestore(), collection, data)
}