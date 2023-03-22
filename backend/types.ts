export interface ISeat {
    id: number;
    row: number;
    number: number;
    isBooked: boolean;
}

export interface IMovie {
    id: number;
    title: string;
    description: string;
    duration: string;
    image: string;
}

export interface ISchedule {
    id: number;
    movie: IMovie;
    date_time: string;
    price: number;
}

export interface IScheduleDB {
    id: number;
    movie_id: number;
    date_time: string;
    price: number;
}

export interface IBookingDB {
    id: number;
    schedule_id: number;
    row: number, 
    number: number; 
    name: string;
}

export interface ISeat {
    id: number;
    row: number;
    number: number;
    isBooked: boolean;
}