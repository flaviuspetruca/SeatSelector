import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Seats from './components/Seats/Seats';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Movies from './components/Movies/Movies';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/movies">Cinema</Navbar.Brand>
                    </Container>
                </Navbar>
                <Routes>
                    <Route path="/movies" index element={<Movies />} />
                    <Route path="/seats" index element={<Seats />} />
                    <Route path="/seats" index element={<Seats />} />
                    <Route path="/*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
