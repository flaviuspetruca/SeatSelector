import * as React from 'react';
import { ISeat } from '../../types';
import { Overlay, Tooltip } from 'react-bootstrap';

import seatIcon from '../../assets/seat.svg';
import seatBooked from '../../assets/seat-booked.svg';
import '../../stylesheets/Seat/Seat.css';

interface IProps {
    seat: ISeat;
    audio: HTMLAudioElement;
    addSeat: (seat: ISeat) => void;
    choosing: boolean;
}

const Seat = (props: IProps) => {
    const seat = props.seat;
    const [show, setShow] = React.useState(false);
    const target = React.useRef(null);

    const handleClick = () => {
        if (!props.choosing) {
            return;
        }
        if (seat.isBooked) {
            props.audio.play();
            return;
        }
        props.addSeat(seat);
        setShow(true);
    };

    return (
        <>
            <div
                ref={target}
                className={`seat ${seat.isBooked ? 'booked' : ''} ${
                    seat.number % 10 === 5 ? 'me-5' : ''
                } ${props.choosing ? 'choosing' : ''}`}
                onMouseOver={() => setShow(true)}
                onMouseOut={() => setShow(false)}
                onClick={handleClick}
            >
                <img src={!seat.isBooked ? seatIcon : seatBooked}></img>
            </div>
            {props.choosing ? (
                <Overlay target={target.current} show={show} placement="right">
                    {(props) => (
                        <Tooltip id="overlay-example" {...props}>
                            {seat.isBooked
                                ? 'Booked'
                                : `Row ${seat.row} Seat ${seat.number}`}
                        </Tooltip>
                    )}
                </Overlay>
            ) : (
                ''
            )}
        </>
    );
};

export default Seat;
