import * as React from 'react';
import { Pagination } from 'react-bootstrap';
import SCHEDULES from '../../assets/schedules.json';
import { ISchedule } from '../../types';
import { getWeekOfYearFromDate, currentWeek } from '../../utils';

import '../../stylesheets/Movies/Movies.css';
import MovieCard from '../MovieCard/MovieCard';

const Movies = () => {
    const [viewWeek, setViewWeek] = React.useState(currentWeek);
    const [calendarColumns, setCalendarColumns] = React.useState<JSX.Element[]>(
        []
    );
    const yearWeeks = 52;

    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const getDayFromDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const getSchedulesForCurrentWeek = (schedules: ISchedule[]) => {
        const currentWeekSchedules = schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.date_time);
            return getWeekOfYearFromDate(scheduleDate) === viewWeek;
        });
        return currentWeekSchedules;
    };

    const getMoviesForDay = (day: string, schedules: ISchedule[]) => {
        const movies: JSX.Element[] = [];
        getSchedulesForCurrentWeek(schedules).forEach((schedule) => {
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

    const getCalendarColumns = (schedules: ISchedule[]) => {
        return days.map((day) => (
            <div className="calendar-column" key={day}>
                <div className="day">{day}</div>
                {getMoviesForDay(day, schedules)}
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
    };

    const onNextClick = () => {
        if (viewWeek === yearWeeks) {
            setViewWeek(0);
        } else {
            setViewWeek(viewWeek + 1);
        }
    };

    React.useEffect(() => {
        // TO DO implement schedules from API
        const schedules = SCHEDULES;
        setCalendarColumns(getCalendarColumns(schedules));
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
                    <Pagination.Next onClick={onNextClick} />
                </Pagination>
                <p className="week-paragraph">Week {viewWeek}</p>
            </div>
            <div className="row calendar">{calendarColumns}</div>
        </div>
    );
};

export default Movies;
