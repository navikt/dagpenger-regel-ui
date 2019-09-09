import { toDate, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { YYYY_MM_FORMAT } from './datoFormat';

export const formatDato = (dato, datoFormat) => format(dato, datoFormat, { locale: nb });

export const eachMonthOfInterval = (dirtyInterval, dirtyOptions) => {
  if (dirtyInterval.length < 1) {
    throw new TypeError(`1 argument required, but only ${dirtyInterval.length} present`);
  }

  const interval = dirtyInterval || {};
  const startDate = toDate(interval.start, dirtyOptions);
  const endDate = toDate(interval.end, dirtyOptions);

  const endTime = endDate.getTime();

  // Throw an exception if start date is after end date or if any date is `Invalid Date`
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError('Invalid interval');
  }

  const dates = [];

  const currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate.getTime() <= endTime) {
    dates.push(formatDato(currentDate, YYYY_MM_FORMAT));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return dates;
};

export const getAlleMåneder = (fraDato, tilDato) => {
  const måneder = eachMonthOfInterval({
    start: new Date(fraDato),
    end: new Date(tilDato),
  });

  return måneder;
};
