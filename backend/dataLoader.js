const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');

function loadDeals() {
  const filePath = path.join(__dirname, 'deals.csv');
  const raw = fs.readFileSync(filePath);

  const deals = parse(raw, {
    columns: true,
    cast: true,
    skip_empty_lines: true,
  });

  const closedDeals = deals.filter(d =>
    d.stage === 'Closed Won' || d.stage === 'Closed Lost'
  );

  const q3Deals = deals.filter(d =>
    d.stage === 'Lead' || d.stage === 'Qualified' || d.stage === 'Proposal'
  );

  return { closedDeals, q3Deals };
}

module.exports = { loadDeals };
