const below1million = 7.5;
const above1million = 5;

const costForMonthly = (pricePerUnitPerYear, spaceToRent, noOfMonths) => {
  pricePerUnitPerYear = Number(pricePerUnitPerYear);
  spaceToRent = Number(spaceToRent);
  noOfMonths = Number(noOfMonths);
  return (pricePerUnitPerYear / 12) * spaceToRent * noOfMonths;
};

const costForYearly = (pricePerUnitPerYear, spaceToRent, noOfYears) => {
  pricePerUnitPerYear = Number(pricePerUnitPerYear);
  spaceToRent = Number(spaceToRent);
  noOfYears = Number(noOfYears);
  return pricePerUnitPerYear * spaceToRent * noOfYears;
};

const transactionFee = (totalCost) => {
  totalCost = Number(totalCost);
  if (totalCost < 1000000) {
    return (totalCost * below1million) / 100;
  } else {
    return (totalCost * above1million) / 100;
  }
};

const totalCost = (totalCost, transactionFee) => {
  totalCost = Number(totalCost);
  transactionFee = Number(transactionFee);
  return totalCost + transactionFee;
};

module.exports = {
  transactionFee,
  totalCost,
  costForMonthly,
  costForYearly,
};