
const dayOfWeekLabels = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const monthLabels = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

function utcDate() {
  return new Date(Date.UTC(...arguments));
}

const rangeList = (length, offset = 0) =>
  new Array(length).fill('').map((value, index) => index + offset);

const getMonthLabel = (month) => monthLabels[month];

const getMonthsInYear = () => rangeList(12);

function getMonthLength(year, month) {
  const maxDays = 31;
  const oneOverMaxDate = utcDate(year, month, maxDays + 1);
  const daysIntoNextMonth = oneOverMaxDate.getDate() - 1;

  return maxDays - daysIntoNextMonth;
}

function getDaysInMonth(year, month) {
  const monthLength = getMonthLength(year, month);

  return rangeList(monthLength, 1);
}

function getPreviousMonthAndYear(year, month) {
  return month === 0 ? {
    year: year - 1,
    month: 11,
  } : {
    year,
    month: month - 1,
  };
}

function getDayOfWeekOverrun(year, month, weekStartDay = 0, extraWeek = false) {
  const endDate = utcDate(year, month, getMonthLength(year, month));
  const overrun = 6 - endDate.getDay();
  const normalisedOverrun = overrun + weekStartDay;

  return (normalisedOverrun > 6 ? 0 : normalisedOverrun) + (extraWeek ? 7 : 0);
}

function getOverrunDaysInMonth(year, month, weekStartDay, extraWeek) {
  const overrun = getDayOfWeekOverrun(year, month, weekStartDay, extraWeek);

  return rangeList(overrun, 1);
}

function getDayOfWeekOffset(year, month, weekStartDay = 0) {
  const startDate = utcDate(year, month, 1);
  const offset = startDate.getDay();
  const normalisedOffset = offset - weekStartDay;
  return normalisedOffset < 0 ? 6 : normalisedOffset;
}

function getOffsetDaysInMonth(year, month, weekStartDay) {
  const offset = getDayOfWeekOffset(year, month, weekStartDay);
  const previousMonthAndYear = getPreviousMonthAndYear(year, month);
  const previousMonthLength = getMonthLength(previousMonthAndYear.year, previousMonthAndYear.month);

  return rangeList(offset, 1 + previousMonthLength - offset);
}

function printCalendar() {
  const year = 2017;
  let output = '';

  getMonthsInYear().forEach(month => {
    let monthOutput = '';
    const offsetList = getOffsetDaysInMonth(year, month, 1);
    const dayList = getDaysInMonth(year, month);
    const overrunList = getOverrunDaysInMonth(year, month, 1, offsetList.length + dayList.length < 36);

    monthOutput += offsetList.length ? `<span>${offsetList.join('</span> <span>')}</span> ` : '';
    monthOutput += `<strong>${dayList.join('</strong> <strong>')}</strong> `;
    monthOutput += overrunList.length ? `<span>${overrunList.join('</span> <span>')}</span> ` : '';

    output += `<div class="month"><h2>${getMonthLabel(month)}</h2><div class="days">${monthOutput}</div></div>`;
  });

  document.write(output);
}

printCalendar();
