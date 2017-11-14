const fs = require('fs');
const csv2json = require('csv2json');

console.log('Converting CSV to JSON');
fs.createReadStream(`${__dirname}/../data/companies.csv`)
  .pipe(csv2json())
  .pipe(fs.createWriteStream(`${__dirname}/../data/companies.json`));
