export const formatertPengesum = (tall) =>
  new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    currencyDisplay: "code", // symbol
    localeMatcher: "lookup",
  }).format(tall);

export const formatertPengesum2 = (value) => {
  const formattedValue = Number(value)
    .toLocaleString("nb-NO")
    .replace(/,|\s/g, " ");
  return `${formattedValue} kr`;
};
