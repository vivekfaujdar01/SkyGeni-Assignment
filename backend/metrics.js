function computeMetrics(closedDeals) {
  const wonDeals = closedDeals.filter(d => d.stage === 'Closed Won');
  const lostDeals = closedDeals.filter(d => d.stage === 'Closed Lost');

  const conversionRate = wonDeals.length / (wonDeals.length + lostDeals.length);

  function CalculateTotalValue(wonDeals){
    let totalValue = 0;
    for(let i = 0; i < wonDeals.length; i++){
      totalValue += wonDeals[i].deal_value;
    }
    return totalValue;
  }
  const totalValue = CalculateTotalValue(wonDeals);
  const avgDealSize = totalValue / wonDeals.length;

  function CalaculateTotalDays(wonDeals){
    let totalDays = 0;
    for(let i = 0; i < wonDeals.length; i++){
      const start = new Date(wonDeals[i].created_date);
      const end = new Date(wonDeals[i].closed_date);
      const days = (end - start) / (1000 * 60 * 60 * 24);
      totalDays += days;
    }
    return totalDays;
  }
  const totalDays = CalaculateTotalDays(wonDeals);
  const avgCycleDays = totalDays / wonDeals.length;



  return {
    conversionRate: parseFloat(conversionRate.toFixed(4)),
    avgDealSize: Math.round(avgDealSize),
    avgCycleDays: Math.round(avgCycleDays),
    totalWon: wonDeals.length,
    totalLost: lostDeals.length
  };
}

module.exports = { computeMetrics };
