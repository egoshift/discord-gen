module.exports = (number) => {
  const formatted = Number(parseFloat(number).toFixed(2)).toLocaleString()
  return `₱ ${formatted}`
}