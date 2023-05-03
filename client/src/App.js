/**
 * @fileoverview App component
 * This file contains the code for the App component.
 * This component is the root component of the React app.
 * It contains the code for the navigation bar and the routing.
 * 
 */

// Import libraries and files
import React from 'react';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import {Navbar, Nav, Container} from 'react-bootstrap';
import DiscoveryPage from './Pages/Discovery';
import SearchPage from './Pages/Search';
import ParkPage from './Pages/Parks';
import './App.css';

// Define App React component
function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            ParkSafari
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav"/>
          <Navbar.Collapse id="navbar-nav">
            <Nav>
              <Nav.Link as={Link} to="/discovery/section1">
                Discovery
              </Nav.Link>
              <Nav.Link as={Link} to="/park">
                Park
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/discovery/*" element={<DiscoveryPage/>}/>
        <Route path="/" element={<SearchPage/>}/>
        <Route path="/park" element={<ParkPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
