
const numberRegex = /^\d+([,.]\d+)?$/;
const integerRegex = /^\s*\d+\s*$/;
const decimalRegex = /^\d+(.\d{1,2})?$/;
const isEmpty = text => text === null || text === undefined || text.toString().trim().length === 0;
const hasValidNumber = text => (isEmpty(text) || numberRegex.test(text) ? null : 'Feltet kan kun inneholde tall');
const hasValidInt = text => (isEmpty(text) || integerRegex.test(text) ? null : 'Tallet kan ikke ha desimaler');
const hasValidDecimal = text => (isEmpty(text) || decimalRegex.test(text) ? null : 'Tallet kan ikke inneholde mer enn to desimaler');

export const required = value => (isEmpty(value) ? 'Feltet må fylles ut' : undefined);
export const minLength = length => text => (isEmpty(text) || text.toString().trim().length >= length ? null : `Du må skrive minst ${length} tegn`);
export const maxLength = length => text => (isEmpty(text) || text.toString().trim().length <= length ? null : `Du kan skrive maksimalt ${length} tegn`);
export const minValue = length => number => (number >= length ? null : `Feltet må være større eller lik ${length}`);
export const maxValue = length => number => (number <= length ? null : `Feltet må være mindre eller lik ${length}`);
export const isValidInteger = text => (hasValidNumber(text) || hasValidInt(text));
export const isValidDecimal = text => (hasValidNumber(text) || hasValidDecimal(text));
