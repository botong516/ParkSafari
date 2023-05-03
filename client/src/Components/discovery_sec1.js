/**
 * @fileoverview This file renders the first section of the discovery page.
 * This section allows the user to find the top most frequently appeared species in 
 * the nearby parks of the 100 top-rated Airbnbs that have trails with popularity less than or equal to 200.
 * The results will be displayed in a form of cards.
 * This section corresponds to the first tab of the discovery page and fetches data from the our first complex query.
*/
// Import required libraries and components
import React, { useState, useEffect, useRef } from "react";
import "./discovery_sec.css";
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Import config file
const config = require('../config.json');

// Define Tab 1 React component
const Section1 = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  // Focus on the input box when the page is loaded
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Fetch data from the backend
  const fetchData = async () => {
    if (inputValue === "") {
      setErrorMessage("Please enter a number.");
      return;
    }
    setErrorMessage(""); // Clear the error message if there was any
    const response = await fetch(
      `http://${config.server_host}:${config.server_port}/species-for-photographers?num=${inputValue}`
    );
    const data = await response.json();
    setResults(data);
  };
  

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  // Define styles
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  const StyledBox = styled(Box)(({ theme }) => ({
    background: '#aac0dc', 
    borderRadius: '16px',
    border: '2px solid #000',
    padding: theme.spacing(3),
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

  // Return the JSX code
  return (
    <div className="section-container">
      <h2>Discover Species in Nearby Parks</h2>
      <p className="instruction-text">
        Enter a number below to find the top most frequently appeared species in the nearby parks of the 100 top-rated Airbnbs that have trails with popularity less than or equal to 200.
      </p>
      <div className="input-container">
        Get top{" "}
        <input
          type="number"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="number-input"
          style={{ width: `${50 + inputValue.length * 10}px`, margin: "10 10px" }}
        />{" "}
        species.
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
        {results && results.length > 0 ? (
        <div>
            <Container style={flexFormat}>
      {results.map((result, index) =>
        <StyledBox key={result.species_id}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <StyledTableCell variant="head">Species:</StyledTableCell>
                <StyledValueCell>{result.common_names}</StyledValueCell>
              </TableRow>
              <TableRow>
                <StyledTableCell variant="head">Occurrence count:</StyledTableCell>
                <StyledValueCell>{result.occurrence_count}</StyledValueCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </StyledBox>
      )}
    </Container>
        </div>
        ) : (
        <p>No results found.</p>
        )}
    </div>
  );
};

export default Section1;
