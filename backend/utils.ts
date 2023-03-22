const getWeekOfYearFromDate = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const currentWeek = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );
    return currentWeek;
};

export {
    getWeekOfYearFromDate
}