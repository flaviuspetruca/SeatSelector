import * as React from 'react';
import { Card } from 'react-bootstrap';
import { ISchedule } from '../../types';

import '../../stylesheets/MovieCard/MovieCard.css';

interface IProps {
    schedule: ISchedule;
}

const MovieCard = (props: IProps) => {
    const getHours = (date: string) => {
        const hours = date.slice(0, 2);
        return Number(hours);
    };

    const getMinutes = (date: string) => {
        const minutes = date.slice(4, 6);
        return Number(minutes);
    };

    const handleMovieClick = () => {
        //redirect to seats page
        window.location.href = `/seats?id=${props.schedule.id}`;
    };

    const movie = props.schedule.movie;
    const date = new Date(props.schedule.date_time);
    const startTime = date.toTimeString().slice(0, 5);
    date.setHours(date.getHours() + getHours(movie.duration));
    date.setMinutes(date.getMinutes() + getMinutes(movie.duration));
    const endTime = date.toTimeString().slice(0, 5);

    return (
        <div className="row movie-card-container" onClick={handleMovieClick}>
            <div className="movie-time col-4">
                <p>{startTime + '-' + endTime}</p>
            </div>
            <Card className="movie-card col-6">
                <Card.Img variant="top" src={movie.image} />
                <Card.Body>
                    <Card.Title className="movie-title mt-3">
                        {movie.title}
                    </Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MovieCard;
