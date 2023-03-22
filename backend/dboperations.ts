import sql from 'mssql';
import config from './dbconfig';
import { IBookingDB, IMovie, ISchedule, IScheduleDB } from './types';

async function connect() {
    try {
        await sql.connect(config);
        console.log('connected');
    } catch (err) {
        console.log(err);
    }    
}

async function addMovies(movies: IMovie[]) {
    const inserted = [];
    try {
        await sql.connect(config);
        //clear the table before inserting
        await sql.query('DELETE FROM MOVIES');
        for (let movie of movies) {
            const title = movie.title;
            const description = movie.description;
            const duration = movie.duration;
            const image = movie.image;
            const query = await sql.query(
                `INSERT INTO MOVIES (title, description, duration, image) 
                OUTPUT Inserted.id VALUES ('${title}', '${description}', '${duration}', '${image}')`);
            inserted.push(query);
        }
        return inserted;
    } catch (err) {
        console.log(err);
    }
}

async function addSchedules(schedules: IScheduleDB[]) {
    const inserted = [];
    try {
        await sql.connect(config);
        //clear the table before inserting
        await sql.query('DELETE FROM SCHEDULES');
        for (let schedule of schedules) {
            const movieId = schedule.movie_id;
            const dateTime = schedule.date_time;
            const price = schedule.price;
            const query = await sql.query(
                `INSERT INTO SCHEDULES (movie_id, date_time, price) 
                OUTPUT Inserted.id VALUES (${movieId}, '${dateTime}', ${price})`);
            inserted.push(query);
        }
        return inserted;
    } catch (err) {
        console.log(err);
    }
}

async function addBooking(schedule_id: number, seats: {row: number, number: number}[] , name: string) {
    let addedBookings = [];
    try {
    for (let seat of seats) {
            await sql.connect(config);
            const query = await sql.query(
                `INSERT INTO Reserved_Seats (schedule_id, row, number, name) 
                OUTPUT Inserted.id VALUES (${schedule_id}, ${seat.row}, ${seat.number}, '${name}')`);
            addedBookings.push(query.recordset[0]);
        }
        return addedBookings;
    } catch (err) {
        console.log(err);
    }
}

async function getSchedules(): Promise<ISchedule[]> {
    try {
        await sql.connect(config);
        const query = await sql.query(
            `SELECT S.id, S.movie_id, S.date_time, S.price, M.title, M.description, M.duration, M.image
            FROM SCHEDULES S
            INNER JOIN MOVIES M
            ON S.movie_id = M.id`);
        const schedules: ISchedule[] = [];
        for (let row of query.recordset) {
            const schedule: ISchedule = rowToSchedule(row);
            schedules.push(schedule);
        }
        return schedules;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getBookings(id: number): Promise<IBookingDB[]> {
    try {
        await sql.connect(config);
        const query = await sql.query(
            `SELECT * FROM Reserved_Seats WHERE schedule_id = ${id}`);
        return query.recordset;
    } catch (err) {
        console.log(err);
        return [];
    }
}



async function getSchedule(id: number): Promise<ISchedule> {
    try {
        await sql.connect(config);
        const query = await sql.query(
            `SELECT S.id, S.movie_id, S.date_time, S.price, M.title, M.description, M.duration, M.image
            FROM SCHEDULES S JOIN MOVIES M ON S.movie_id = M.id
            WHERE S.id = ${id}`);
            return rowToSchedule(query.recordset[0]);
    } catch (err) {
        console.log(err);
        return {} as ISchedule;
    }
}

const rowToSchedule = (row: any): ISchedule => {
    return {
        id: row.id,
        movie: {
            id: row.movie_id,
            title: row.title,
            description: row.description,
            duration: row.duration,
            image: row.image
        },
        date_time: row.date_time,
        price: row.price
    }
}

export {connect, addMovies, addSchedules, getSchedules, getSchedule, addBooking, getBookings};