export const formatertPengesum = tall => new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  currencyDisplay: 'symbol'
}).format(tall);
