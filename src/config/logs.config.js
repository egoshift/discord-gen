const sheet = {
  name: 'LOGS',
  start: 'A',
  end: 'L',
}

const range = `${sheet.name}!${sheet.start}:${sheet.end}`

const columns = {
  date: 0,
  category: 1,
  categoryName: 2,
  fromAccountType: 3,
  fromAccount: 4,
  toAccountType: 5,
  toAccount: 6,
  particular: 7,
  finalAmount: 8,
  finalTransfer: 9,
  displayAmount: 10,
  remarks: 11
}

const formulas = {
  category: row => `=INDEX(SETTINGS!$I:$I,MATCH(C${row},SETTINGS!$J:$J,0))`,
  accountFrom: row => `=INDEX(SETTINGS!$D:$D,MATCH(E${row},SETTINGS!$F:$F,0))`,
  accountTo: row => `=IFERROR(INDEX(SETTINGS!$D:$D,MATCH(G${row},SETTINGS!$F:$F,0)), "-")`,
  finalAmount: row => (
    `=IF(OR(OR(EQ(B${row},"expenses"),EQ(B${row},"credit")),EQ(C${row},"transfer")),K${row}*-1,K${row})`
  ),
  finalTransfer: row => (`=IF(EQ(C${row},"transfer"),K${row},0)`),
}

module.exports = {
  sheet, range, columns, formulas
}