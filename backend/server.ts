import express from 'express';
import {connect, addMovies, addSchedules, getSchedules, getSchedule, addBooking, getBookings} from './dboperations';
//import config from './dbconfig';
import cors from 'cors';
import { IBookingDB, IMovie, ISchedule, ISeat } from './types';
import { getWeekOfYearFromDate } from './utils';

const router = express.Router();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', router);
app.listen(3001);

/* const status = (response: any) : number => {
    return response?.rowsAffected[0] === 1 ? 200 : 400;
} */

router.get('/', async (_req, _res) => {
    await connect();
});

const convertDurationToHourAndMinutes = (movie: IMovie) => {
    // trim "min" from movie duration 
    movie.duration = movie.duration.replace('min', '');
    const hours = Math.floor(Number(movie.duration) / 60);
    const minutes = Number(movie.duration) % 60;
    movie.duration = `${hours < 10 ? '0'+ hours : hours}h ${minutes}m`;
    return movie;
}

const convertBookingsToSeats = (bookings: IBookingDB[]): ISeat[] => {
    const seats: ISeat[] = [];
    for (let booking of bookings) {
        seats.push({
            id: booking.number,
            row: booking.row,
            number: booking.number,
            isBooked: true
        });
    }
    return seats;
}

router.post('/movies', async (req, res) => {
    const response = await addMovies(req.body);
    res.status(200).send(response);
});

router.get('/schedules', async (req, res) => {
    if ( !req.query.viewWeek ) {
        res.status(400).send('viewWeek query parameter is required');
        return;
    }
    const response = await getSchedules();
    const getSchedulesForCurrentWeek = (schedules: ISchedule[]) => {
        const currentWeekSchedules = schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.date_time);
            return getWeekOfYearFromDate(scheduleDate) === Number(req.query.viewWeek);
        });
        return currentWeekSchedules;
    };
    const currentWeekSchedules = getSchedulesForCurrentWeek(response);
    res.status(200).send(currentWeekSchedules);
});

router.get('/schedule', async (req, res) => {
    if ( !req.query.id ) {
        res.status(400).send('id query parameter is required');
        return;
    }
    const response = await getSchedule(Number(req.query.id));
    res.status(response.id ? 200 : 404).send(response);
});

router.post('/schedules', async (req, res) => {
    const response = await addSchedules(req.body);
    res.status(200).send(response);
});

router.post('/bookseats', async (req, res) => {
    const schedule_id = req.query.schedule_id;
    if ( !schedule_id ) {
        res.status(400).send('schedule_id query parameter is required');
        return;
    }
    const response = await addBooking(Number(schedule_id), req.body.seats, req.body.name);
    res.status(200).send(response);
});

router.get('/reservedseats', async (req, res) => {
    const schedule_id = req.query.schedule_id;
    if ( !schedule_id ) {
        res.status(400).send('schedule_id query parameter is required');
        return;
    }
    const response = await getBookings(Number(schedule_id));
    const bookings = convertBookingsToSeats(response);
    res.status(200).send(bookings);
});

router.post('/convertJSON', async (req, res) => {
    console.log(req.body)
    const response = [];
    for (let movie of req.body) {
        response.push(convertDurationToHourAndMinutes(movie));
    }
    res.status(200).send(JSON.stringify(response));
});