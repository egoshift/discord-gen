module.exports = (firestore, collection, data) => {
  const reference = firestore.collection(collection).doc()

  reference.set(data)
}