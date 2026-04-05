const express = require('express');
const cors = require('cors');
const { loadDeals } = require('./dataLoader');
const { computeMetrics } = require('./metrics');
const { simulate } = require('./simulator');

const app = express();
app.use(cors());
app.use(express.json());

const { closedDeals, q3Deals } = loadDeals();
const metrics = computeMetrics(closedDeals);

console.log('Data loaded:');
console.log(`Closed deals (Q1+Q2): ${closedDeals.length}`);
console.log(`Open deals (Q3): ${q3Deals.length}`);
console.log(`Baseline Conversion Rate: ${(metrics.conversionRate * 100).toFixed(1)}%`);
console.log(`Baseline Avg Deal Size: ₹${metrics.avgDealSize.toLocaleString()}`);
console.log(`Avg Sales Cycle: ${metrics.avgCycleDays} days`);

app.get('/metrics', (req, res) => {
  return res.json(metrics);
});

app.post('/simulate', (req, res) => {
  const { conversionDelta = 0, dealSizeDelta = 0 } = req.body;

  if (typeof conversionDelta !== 'number' || typeof dealSizeDelta !== 'number') {
    return res.status(400).json({ error: 'conversionDelta and dealSizeDelta must be numbers' });
  }

  const result = simulate(q3Deals, metrics, { conversionDelta, dealSizeDelta });
  return res.json(result);
});

app.get('/health', (req, res) => {
  return res.json({ status: 'ok', message: 'SkyGeni Revenue Simulator running!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\nBackend running on http://localhost:${PORT}`);
  console.log(`\nhttp://localhost:${PORT}/metrics`);
});
