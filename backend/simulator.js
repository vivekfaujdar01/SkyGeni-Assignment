function simulate(q3Deals, metrics, changes) {
  const { conversionDelta = 0, dealSizeDelta = 0 } = changes;

  const newConversionRate = metrics.conversionRate * (1 + conversionDelta / 100);
  const newAvgDealSize = metrics.avgDealSize * (1 + dealSizeDelta / 100);

  const totalQ3Deals = q3Deals.length;

  const weeksCount = 13;
  const dealsPerWeek = totalQ3Deals / weeksCount;

  const baselineWeekly = [];
  const scenarioWeekly = [];

  for (let i = 0; i < weeksCount; i++) {
    baselineWeekly.push(
      Math.round(dealsPerWeek * metrics.conversionRate * metrics.avgDealSize)
    );
    scenarioWeekly.push(
      Math.round(dealsPerWeek * newConversionRate * newAvgDealSize)
    );
  }

  const baselineTotal = baselineWeekly.reduce((a, b) => a + b, 0);
  const scenarioTotal = scenarioWeekly.reduce((a, b) => a + b, 0);

  const absoluteImpact = scenarioTotal - baselineTotal;
  const percentageImpact = ((absoluteImpact / baselineTotal) * 100).toFixed(1);

  const drivers = buildInsight(changes, absoluteImpact, percentageImpact);

  const result = {
    baseline: {
      weekly_revenue: baselineWeekly,
      total_revenue: baselineTotal,
    },
    scenario: {
      weekly_revenue: scenarioWeekly,
      total_revenue: scenarioTotal,
      conversion_rate: parseFloat(newConversionRate.toFixed(4)),
      avg_deal_size: Math.round(newAvgDealSize),
    },
    impact: {
      absolute: absoluteImpact,
      percentage: parseFloat(percentageImpact),
    },
    drivers,
    q3_deals_count: totalQ3Deals,
  };

  console.log('\n--- Simulation Output ---');
  console.log(JSON.stringify(result, null, 2));
  
  return result;
}

function buildInsight(changes, absoluteImpact, percentageImpact) {
  const drivers = [];

  if (changes.conversionDelta > 0) {
    drivers.push(`Conversion rate improved by ${changes.conversionDelta}%`);
  } else if (changes.conversionDelta < 0) {
    drivers.push(`Conversion rate decreased by ${Math.abs(changes.conversionDelta)}%`);
  }

  if (changes.dealSizeDelta > 0) {
    drivers.push(`Average deal size increased by ${changes.dealSizeDelta}%`);
  } else if (changes.dealSizeDelta < 0) {
    drivers.push(`Average deal size decreased by ${Math.abs(changes.dealSizeDelta)}%`);
  }

  if (drivers.length === 0) {
    drivers.push('No changes applied — showing baseline projection');
  }

  return drivers;
}

module.exports = { simulate };
