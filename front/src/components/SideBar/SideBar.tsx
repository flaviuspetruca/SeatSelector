import Button from 'react-bootstrap/Button';
import { ISeat } from '../../types';
import seatIcon from '../../assets/seat.svg';

import '../../stylesheets/SideBar/SideBar.css';

interface IProps {
    selectedSeats: ISeat[];
    removeSelectedSeat: (seat: ISeat) => void;
    openModal: () => void;
}

const SideBar = (props: IProps) => {
    const selectedSeats = props.selectedSeats;
    const removeSelectedSeat = props.removeSelectedSeat;
    const openModal = props.openModal;
    return (
        <div className="sidebar">
            <h3 className="subheader text-white">Selected seats</h3>
            {selectedSeats.length === 0 ? (
                <p className="text-white">No seats selected</p>
            ) : (
                ''
            )}
            {selectedSeats.map((seat) => (
                <div key={seat.id} className="selected-seat">
                    <img src={seatIcon}></img>
                    <p>
                        Row {seat.row} Seat {seat.number}
                    </p>

                    <Button
                        className="button-remove"
                        onClick={() => removeSelectedSeat(seat)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                disabled={selectedSeats.length === 0}
                variant="success"
                className="button-add"
                onClick={openModal}
            >
                Book
            </Button>
        </div>
    );
};

export default SideBar;
