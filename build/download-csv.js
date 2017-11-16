const axios = require('axios');
const fs = require('fs');

console.log('Downloading CSV...');
(async () => {
  try {
    const { data } = await axios.get('http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download');
    if (data) fs.writeFileSync(`${__dirname}/../data/companies.csv`, data);
  } catch (err) {
    console.log(err);
  }
})();
console.log('Finished downloading CSV.');
