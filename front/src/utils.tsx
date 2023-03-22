const getWeekOfYearFromDate = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const currentWeek = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );
    return currentWeek;
};

const getDayFromDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const nextWeek = (week: number) => {
    if (week === yearWeeks) {
        return 0;
    } else {
        return week + 1;
    }
};

const timeZone = 'Europe/Bucharest';
const date = new Date();
const timeString = date.toLocaleString('en-US', { timeZone });
const currentWeek = getWeekOfYearFromDate(new Date(timeString));

const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];
const yearWeeks = 52;

const API_URL = 'http://localhost:3001/api';

export {
    getWeekOfYearFromDate,
    currentWeek,
    API_URL,
    yearWeeks,
    days,
    getDayFromDate,
    nextWeek,
};
