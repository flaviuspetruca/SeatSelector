import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Seats from './components/Seats/Seats';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/movies">Cinema</Navbar.Brand>
                        <Nav className="navbar-link-container me-auto">
                            <Link to="/movies">Movies</Link>
                        </Nav>
                    </Container>
                </Navbar>
                <Routes>
                    <Route path="/movies" index element={<Seats />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
