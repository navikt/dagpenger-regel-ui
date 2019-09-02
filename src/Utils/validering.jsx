const numberRegex = /^\d+([,.]\d+)?$/;
const integerRegex = /^\s*\d+\s*$/;
const decimalRegex = /^\d+(.\d{1,2})?$/;
const fodselsnummerPattern = /^\d{11}$/;

const sum = (fodselsnummer, faktors) => {
  let s = 0;
  for (let i = 0; i < faktors.length; i += 1) {
    s += parseInt(fodselsnummer[i], 10) * faktors[i];
  }
  return s;
};

export const isValidFodselsnummer = input => {
  const fodselsnummer = `${input}`;
  if (!fodselsnummerPattern.test(fodselsnummer)) {
    return false;
  }
  let factors = [3, 7, 6, 1, 8, 9, 4, 5, 2];
  let checksumOne = 11 - (sum(fodselsnummer, factors) % 11);
  if (checksumOne === 11) {
    checksumOne = 0;
  }
  factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let checksumTwo = 11 - (sum(fodselsnummer, factors) % 11);
  if (checksumTwo === 11) {
    checksumTwo = 0;
  }
  return checksumOne === parseInt(fodselsnummer[9], 10) && checksumTwo === parseInt(fodselsnummer[10], 10);
};

const isEmpty = text => text === null || text === undefined || text.toString().trim().length === 0;
const hasValidNumber = text => (isEmpty(text) || numberRegex.test(text) ? null : 'Feltet kan kun inneholde tall');
const hasValidInt = text => (isEmpty(text) || integerRegex.test(text) ? null : 'Tallet kan ikke ha desimaler');
const hasValidDecimal = text => (isEmpty(text) || decimalRegex.test(text) ? null : 'Tallet kan ikke inneholde mer enn to desimaler');

export const required = value => (isEmpty(value) ? 'Feltet må fylles ut' : undefined);
export const minLength = length => text => (isEmpty(text) || text.toString().trim().length >= length ? null : `Du må skrive minst ${length} tegn`);
export const maxLength = length => text => (isEmpty(text) || text.toString().trim().length <= length ? null : `Du kan skrive maksimalt ${length} tegn`);
export const minValue = length => number => (number >= length ? null : `Feltet må være større eller lik ${length}`);
export const maxValue = length => number => (number <= length ? null : `Feltet må være mindre eller lik ${length}`);
export const isValidInteger = text => hasValidNumber(text) || hasValidInt(text);
export const isValidDecimal = text => hasValidNumber(text) || hasValidDecimal(text);
export const hasValidOrgNumber = number => (number.toString().trim().length === 9 ? null : 'Ugyldig orgnr');
export const hasValidFodselsnummer = text => (!isValidFodselsnummer(text) ? 'Ugyldig fødselsnummer' : null);
