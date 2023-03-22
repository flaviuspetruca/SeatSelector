import { useEffect, useState } from 'react';
import { ISchedule, ISeat } from '../../types';
import SEATS from '../../assets/seats.json';
import SCHEDULES from '../../assets/schedules.json';
import screen from '../../assets/screen2.svg';
import audioWrong from '../../assets/stop.mp3';

import Seat from '../Seat/Seat';

import '../../stylesheets/Seats/Seats.css';
import { Button } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import BookingForm from '../BookingForm/BookingForm';
import { API_URL } from '../../utils';

const Seats = () => {
    const [seats, setSeats] = useState<ISeat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
    const [schedule, setSchedule] = useState<ISchedule | undefined>();
    const [choosing, setChoosing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rerender, setRerender] = useState(false);

    const params = new URLSearchParams(document.location.search);
    const id = params.get('id');

    const handleSeatSelection = () => {
        setChoosing(!choosing);
    };

    const handleSeatClick = (seat: ISeat) => {
        if (selectedSeats.find((s) => s.id === seat.id)) {
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
        localStorage.setItem(
            `selectedSeats-${id}`,
            JSON.stringify(selectedSeats)
        );
        setSelectedSeats([...selectedSeats]);
    };

    const resetSelectedSeats = () => {
        localStorage.removeItem(`selectedSeats-${id}`);
        setSelectedSeats([]);
        setChoosing(false);
    };

    useEffect(() => {
        const getSchedule = async () => {
            if (!id) {
                window.location.href = '/not-found';
            }
            const response = await fetch(`${API_URL}/schedule?id=${id}`);
            const data = await response.json();
            setSchedule(data);
        };

        const getSeats = async () => {
            const mockSeats = SEATS;
            const response = await fetch(
                `${API_URL}/reservedseats?schedule_id=${id}`
            );
            const data = await response.json();
            data.map((seat: ISeat) => {
                const mockSeat = mockSeats.find((s) => s.id === seat.id);
                if (mockSeat) {
                    mockSeat.isBooked = true;
                }
            });
            setSeats(mockSeats);
        };
        getSeats();
        getSchedule();

        const selectedSeats = localStorage.getItem(`selectedSeats-${id}`);
        if (selectedSeats) {
            setSelectedSeats(JSON.parse(selectedSeats));
        }
    }, [rerender]);

    const rows: JSX.Element[] = [];
    let currentRow = 0;
    let rowSeats: JSX.Element[] = [];
    let audio = new Audio(audioWrong);

    // Loop through the seats and group them by row
    seats.forEach((seat) => {
        if (seat.row !== currentRow) {
            // If we've reached a new row, add the previous row's seats to the rows array
            rows.push(
                <div className="row" key={`row-${seat.row}`}>
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
                audio={audio}
                key={`seat-${seat.id}`}
            ></Seat>
        );
    });

    // Add the last row's seats to the rows array
    rows.push(
        <div className="row" key={`row-${currentRow + 1}`}>
            {rowSeats}
        </div>
    );

    return (
        <div style={{ height: '100%' }}>
            <BookingForm
                schedule_id={Number(id)}
                selectedSeats={selectedSeats}
                showModal={showModal}
                setShowModal={setShowModal}
                resetSelectedSeats={resetSelectedSeats}
                rerender={rerender}
                setRerender={setRerender}
            ></BookingForm>
            <div className="container-seats">
                <div className="info-container">
                    {schedule && !choosing ? (
                        <div className="movie-info">
                            <img
                                src={schedule.movie.image}
                                className="poster"
                            ></img>
                            <h1 className="header">{schedule.movie.title}</h1>
                            <p className="subsubheader">
                                {schedule.movie.description}
                            </p>
                            <p className="subsubheader">
                                {new Date(
                                    schedule.date_time
                                ).toLocaleDateString()}
                            </p>
                            <p className="subsubheader">
                                {new Date(
                                    schedule.date_time
                                ).toLocaleTimeString()}
                            </p>
                        </div>
                    ) : (
                        ''
                    )}
                    <div className="seat-selector">
                        <div className="header">
                            <h1 className="header mt-5">Seats</h1>
                            {schedule && choosing ? (
                                <div className="small-movie-info">
                                    <h1 className="subheader">
                                        {schedule.movie.title}
                                    </h1>
                                    <p className="subsubheader">
                                        {schedule.movie.description}
                                    </p>
                                    <p className="subsubheader">
                                        {new Date(
                                            schedule.date_time
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="subsubheader">
                                        {new Date(
                                            schedule.date_time
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            ) : (
                                ''
                            )}
                            <Button
                                variant={!choosing ? 'primary' : 'warning'}
                                onClick={handleSeatSelection}
                            >
                                {!choosing ? 'Choose seats' : 'Cancel'}
                            </Button>
                        </div>
                        <img src={screen} className="screenSVG"></img>
                        <div className="mb-5">{rows}</div>
                    </div>
                </div>
                {choosing ? (
                    <SideBar
                        selectedSeats={selectedSeats}
                        removeSelectedSeat={removeSelectedSeat}
                        openModal={() => setShowModal(!showModal)}
                    ></SideBar>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default Seats;
