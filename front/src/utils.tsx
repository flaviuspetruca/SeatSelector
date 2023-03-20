const getWeekOfYearFromDate = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const currentWeek = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );
    return currentWeek;
};

const timeZone = 'Europe/Bucharest';
const date = new Date();
const timeString = date.toLocaleString('en-US', { timeZone });
const currentWeek = getWeekOfYearFromDate(new Date(timeString));

export { getWeekOfYearFromDate, currentWeek };
