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
