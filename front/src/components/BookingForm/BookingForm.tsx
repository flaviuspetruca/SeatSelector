import * as React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ISeat } from '../../types';

import '../../stylesheets/BookingForm/BookingForm.css';

interface IProps {
    selectedSeats: ISeat[];
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    resetSelectedSeats: () => void;
}

const BookingForm = (props: IProps) => {
    const selectedSeats = props.selectedSeats;
    const showModal = props.showModal;
    const setShowModal = props.setShowModal;
    const resetSelectedSeats = props.resetSelectedSeats;

    const [name, setName] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleModalClose = () => {
        setShowModal(false);
        setName('');
    };

    const handleBooking = () => {
        if (name === '') {
            // TO DO Add notification
            if (inputRef.current) {
                inputRef.current.style.border = '2px solid rgb(187, 0, 0)';
                inputRef.current.style.setProperty(
                    '--placeholder-color',
                    'rgb(187, 0, 0)'
                );
            }
            return;
        }
        // TO DO Add booking and notification
        setShowModal(false);
        setName('');
        resetSelectedSeats();
    };

    return (
        <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Fill in the information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group key={'from-group1'} className="form-group">
                        <Form.Label>Movie title</Form.Label>
                        <br />
                        <Form.Text>Movie title</Form.Text>
                    </Form.Group>
                    <Form.Group key={'form-group2'} className="form-group">
                        <Form.Label>Date</Form.Label>
                        <br />
                        <Form.Text>Movie date</Form.Text>
                    </Form.Group>
                    <Form.Group key={'form-group3'} className="form-group">
                        <Form.Label>Name </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            onChange={(e) => {
                                setName(e.target.value);
                                if (inputRef.current) {
                                    inputRef.current.style.border =
                                        '1px solid #ced4da';
                                    inputRef.current.style.setProperty(
                                        '--placeholder-color',
                                        '#6c757d'
                                    );
                                }
                            }}
                            ref={inputRef}
                        />
                    </Form.Group>
                    <Form.Group key={'form-group4'} className="form-group">
                        <Form.Label>Selected seats </Form.Label>
                        <br />
                        {selectedSeats.map((seat) => (
                            <div key={`sc-${seat.id}`}>
                                <Form.Text>
                                    R{seat.row} N{seat.number}
                                </Form.Text>
                            </div>
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Hide
                </Button>
                <Button variant="success" onClick={handleBooking}>
                    Finish
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BookingForm;
