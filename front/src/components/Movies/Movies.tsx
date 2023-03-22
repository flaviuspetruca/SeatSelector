import * as React from 'react';
import { Pagination } from 'react-bootstrap';
import { ISchedule } from '../../types';
import {
    getWeekOfYearFromDate,
    currentWeek,
    API_URL,
    yearWeeks,
    days,
    getDayFromDate,
    nextWeek,
} from '../../utils';

import '../../stylesheets/Movies/Movies.css';
import MovieCard from '../MovieCard/MovieCard';

const Movies = () => {
    const [viewWeek, setViewWeek] = React.useState(currentWeek);
    const [retrievedWeeks, setRetrievedWeeks] = React.useState<number[]>([]);
    const [schedules, setSchedules] = React.useState<ISchedule[]>([]);
    const [calendarColumns, setCalendarColumns] = React.useState<JSX.Element[]>(
        []
    );

    const [nextDisabled, setNextDisabled] = React.useState(false);

    const getWeekSchedulesFromAPI = async (
        weekToGet?: number
    ): Promise<ISchedule[]> => {
        const response = await fetch(
            `${API_URL}/schedules?viewWeek=${weekToGet ? weekToGet : viewWeek}`
        );
        const schedules = await response.json();
        return schedules;
    };

    const getSchedules = async () => {
        let schedulesToBuild: ISchedule[] = schedules;
        if (!retrievedWeeks.includes(viewWeek)) {
            const currentWeekSchedules = await getWeekSchedulesFromAPI();

            const nextWeekSchedules = await getWeekSchedulesFromAPI(
                nextWeek(viewWeek)
            );
            const newSchedules = pushToSchedules(currentWeekSchedules);
            pushToSchedules(nextWeekSchedules);
            schedulesToBuild = newSchedules;

            const newRenderedWeeks = retrievedWeeks;
            if (!newRenderedWeeks.includes(viewWeek)) {
                newRenderedWeeks.push(viewWeek);
                newRenderedWeeks.push(nextWeek(viewWeek));
            }
            setRetrievedWeeks(newRenderedWeeks);
            console.log(nextWeekSchedules);
            if (nextWeekSchedules.length === 0) {
                setNextDisabled(true);
            }
        } else {
            if (
                getSchedulesForWeek(schedulesToBuild, nextWeek(viewWeek))
                    .length === 0
            ) {
                setNextDisabled(true);
            }
        }
        setCalendarColumns(buildCalendarColumns(schedulesToBuild));
        return schedulesToBuild;
    };

    const pushToSchedules = (schedulesToPush: ISchedule[]) => {
        const newSchedules: ISchedule[] = schedules;
        schedulesToPush.forEach((schedule) => {
            if (!newSchedules.find((s) => s.id === schedule.id)) {
                newSchedules.push(schedule);
            }
        });
        setSchedules(newSchedules);
        return newSchedules;
    };

    const getSchedulesForWeek = (schedules: ISchedule[], week?: number) => {
        const currentWeekSchedules = schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.date_time);
            return (
                getWeekOfYearFromDate(scheduleDate) === (week ? week : viewWeek)
            );
        });
        return currentWeekSchedules;
    };

    const buildMoviesForDay = (day: string, schedules: ISchedule[]) => {
        const movies: JSX.Element[] = [];
        schedules.forEach((schedule) => {
            const scheduleDate = new Date(schedule.date_time);
            if (getDayFromDate(scheduleDate) === day) {
                movies.push(
                    <MovieCard schedule={schedule} key={schedule.id} />
                );
            }
        });
        if (movies.length === 0) {
            return <p className="no-movies">No movies on this day</p>;
        } else {
            return movies;
        }
    };

    const buildCalendarColumns = (schedules: ISchedule[]) => {
        const viewWeekSchedules = getSchedulesForWeek(schedules);
        return days.map((day) => (
            <div className="calendar-column" key={day}>
                <div className="day">{day}</div>
                {buildMoviesForDay(day, viewWeekSchedules)}
            </div>
        ));
    };

    const onPrevClick = () => {
        if (viewWeek === currentWeek) {
            return;
        }
        if (viewWeek === 0) {
            setViewWeek(yearWeeks);
        } else {
            setViewWeek(viewWeek - 1);
        }

        setNextDisabled(false);
    };

    const onNextClick = () => {
        setViewWeek(nextWeek(viewWeek));
    };

    React.useEffect(() => {
        if (!retrievedWeeks.includes(viewWeek)) {
            getSchedules();
        } else {
            setCalendarColumns(buildCalendarColumns(schedules));
        }
    }, [viewWeek]);

    return (
        <div className="movies-container">
            <h1 className="header">Movies</h1>
            <div className="d-flex flex-row">
                <Pagination>
                    <Pagination.Prev
                        disabled={viewWeek === currentWeek}
                        onClick={onPrevClick}
                    />
                    <Pagination.Next
                        disabled={nextDisabled}
                        onClick={onNextClick}
                    />
                </Pagination>
                <p className="week-paragraph">Week {viewWeek}</p>
            </div>
            <div className="row calendar">{calendarColumns}</div>
        </div>
    );
};

export default Movies;
