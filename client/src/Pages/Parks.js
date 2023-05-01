import React, { useState, useEffect } from "react";
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import "./ParksPage.css";

const config = require('../config.json');

const ParksPage = () => {
  const [results, setResults] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/parks`);
    const data = await response.json();
    setResults(data);
  };

  const handleParkClick = (park) => {
    setSelectedPark(park);
  };

  const FloatingParkCard = ({ park, onClose }) => {
    return (
      <div className="floating-park-card-overlay">
        <div className="floating-park-card">
          {/* Close button */}
          <button className="close-button" onClick={onClose}>
            &times;
          </button>

          {/* Park details */}
          <h2><span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>{park.park_name}</span></h2>
          <hr className="separator" />
          <p>Park Code: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.park_code}</span></p>
          <p>State: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.state}</span></p>
          <p>Acres: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.acres}</span></p>
          <p>Latitude: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.latitude}</span></p>
          <p>Longitude: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.longitude}</span></p>
          <p>Number of Species: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.species_count}</span></p>
        </div>
      </div>
    );
  };


  const flexFormat = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  };

  const StyledBox = styled(Box)(({ theme }) => ({
    background: '#aac0dc',
    borderRadius: '16px',
    border: '2px solid #000',
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: '1px solid #000',
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
  }));

  const StyledValueCell = styled(TableCell)(({ theme }) => ({
    borderBottom: '1px solid #000',
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    fontWeight: 'bold',
    fontSize: '1.2rem',
  }));

  return (
    <div className="parks">
    <div className="section-container">
      <h2><span style={{fontFamily: "Apple Chancery", fontSize: '50px', fontWeight: 'bold', textShadow: '2px 2px 3px rgba(0, 0, 0, 0.3)',}}>National Parks</span></h2>
      <Container style={flexFormat}>
        {results.map((result, index) => (
          <StyledBox key={result.park_code}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <StyledTableCell variant="head">Park name:</StyledTableCell>
                    <StyledValueCell>
                      <span
                        className="park-name-link"
                        onClick={() => handleParkClick(result)}
                      >
                        {result.park_name}
                      </span>
                    </StyledValueCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell variant="head">State:</StyledTableCell>
                    <StyledValueCell>{result.state}</StyledValueCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell variant="head">Acres:</StyledTableCell>
                    <StyledValueCell>{result.acres}</StyledValueCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </StyledBox>
        ))}
      </Container>
      {selectedPark && (
        <FloatingParkCard
          park={selectedPark}
          onClose={() => setSelectedPark(null)}
        />
      )}
    </div>
    </div>
  );
};

export default ParksPage;
