import { useEffect, useState } from 'react';
import { ISeat } from '../../types';
import SEATS from '../../assets/seats.json';
import screen from '../../assets/screen2.svg';
import seatIcon from '../../assets/seat.svg';
import Seat from '../Seat/Seat';

import '../../stylesheets/Seats/Seats.css';
import { Button, Form, Modal } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';

const Seats = () => {
    const [seats, setSeats] = useState<ISeat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
    const [choosing, setChoosing] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSeatSelection = () => {
        setChoosing(!choosing);
    };

    const handleSeatClick = (seat: ISeat) => {
        if (selectedSeats.includes(seat)) {
            // TO DO Add notification
            return;
        }
        selectedSeats.push(seat);
        localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        setSelectedSeats([...selectedSeats]);
    };

    const removeSelectedSeat = (seat: ISeat) => {
        const index = selectedSeats.indexOf(seat);
        if (index > -1) {
            selectedSeats.splice(index, 1);
        }
        localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        setSelectedSeats([...selectedSeats]);
    };

    useEffect(() => {
        const getSeats = async () => {
            setSeats(SEATS);
            /* const response = await fetch('http://localhost:3000/seats')
            const data = await response.json()
            setSeats(data) */
        };
        getSeats();
        // get selected seats from localstorage
        const selectedSeats = localStorage.getItem('selectedSeats');
        if (selectedSeats) {
            setSelectedSeats(JSON.parse(selectedSeats));
        }
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
        <>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Fill in the information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name: </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Movie </Form.Label>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Hide
                    </Button>
                </Modal.Footer>
            </Modal>
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
                    <SideBar
                        selectedSeats={selectedSeats}
                        removeSelectedSeat={removeSelectedSeat}
                        openModal={() => setShowModal(true)}
                    ></SideBar>
                ) : (
                    ''
                )}
            </div>
        </>
    );
};

export default Seats;
