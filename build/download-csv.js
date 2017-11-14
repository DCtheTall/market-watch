const axios = require('axios');
const fs = require('fs');

console.log('Downloading CSV...');
(async () => {
  const { data } = await axios.get('http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download');
  fs.writeFileSync(`${__dirname}/../data/companies.csv`, data);
})();
console.log('Finished downloading CSV.');
