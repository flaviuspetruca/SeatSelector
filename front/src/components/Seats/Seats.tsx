import { useEffect, useState } from 'react';
import { ISeat } from '../../types';
import SEATS from '../../assets/seats.json';
import screen from '../../assets/screen2.svg';
import Seat from '../Seat/Seat';

import '../../stylesheets/Seats/Seats.css';
import { Button } from 'react-bootstrap';

const Seats = () => {
    const [seats, setSeats] = useState<ISeat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
    const [choosing, setChoosing] = useState(false);

    const handleSeatSelection = () => {
        setChoosing(!choosing);
    };

    const handleSeatClick = (seat: ISeat) => {
        if (selectedSeats.includes(seat)) {
            // TO DO Add notification
            return;
        }
        selectedSeats.push(seat);
        setSelectedSeats(selectedSeats);
    };

    useEffect(() => {
        const getSeats = async () => {
            setSeats(SEATS);
            /* const response = await fetch('http://localhost:3000/seats')
            const data = await response.json()
            setSeats(data) */
        };
        getSeats();
    }, []);

    const rows = [];
    let currentRow = 0;
    let rowSeats: JSX.Element[] = [];

    // Loop through the seats and group them by row
    seats.forEach((seat) => {
        if (seat.row !== currentRow) {
            // If we've reached a new row, add the previous row's seats to the rows array
            rows.push(
                <div className="row" key={currentRow}>
                    {rowSeats}
                </div>
            );
            // Start a new row
            currentRow = seat.row;
            rowSeats = [];
        }
        // Add the current seat to the current row's seats array
        rowSeats.push(
            <Seat
                seat={seat}
                choosing={choosing}
                addSeat={handleSeatClick}
            ></Seat>
        );
    });

    // Add the last row's seats to the rows array
    rows.push(
        <div className="row" key={currentRow}>
            {rowSeats}
        </div>
    );

    return (
        <div className="container-seats">
            <div className="seat-selector">
                <div className="header">
                    <h1 className="header">Seats</h1>
                    <Button
                        variant={!choosing ? 'primary' : 'warning'}
                        onClick={handleSeatSelection}
                    >
                        {!choosing ? 'Choose seats' : 'Cancel'}
                    </Button>
                </div>
                <img src={screen} className="screenSVG"></img>
                <div>{rows}</div>
            </div>
            {choosing ? (
                <div className="sidebar">
                    <h3 className="subheader text-white">Selected seats</h3>
                    {selectedSeats.map((seat) => (
                        <div className="selected-seat">
                            <p className="text-white">
                                Row {seat.row} Seat {seat.number}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default Seats;
