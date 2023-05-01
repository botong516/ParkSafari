import React, { useState, useEffect, useRef } from "react";
import "./discovery_sec.css";
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/system';


const config = require('../config.json');
const Section2 = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);
    // useEffect(() => {
    //     fetch(`http://${config.server_host}:${config.server_port}/random`)
    //     .then(res => res.json())
    //     .then(resJson => {
    //         setResults(resJson);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const fetchData = async () => {
  //   const response = await fetch(`http://${config.server_host}:${config.server_port}/popular-species?num=${inputValue}`);
  //   const data = await response.json();
  //   setResults(data);
  // };

  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    if (inputValue === "") {
      setErrorMessage("Please enter a number.");
      return;
    }
    setErrorMessage(""); // Clear the error message if there was any
    const response = await fetch(
      `http://${config.server_host}:${config.server_port}/popular-species?num=${inputValue}`
    );
    const data = await response.json();
    setResults(data);
  };  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

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

  return (
    <div className="section-container">
      <h2>Discover Species in Popular Trails</h2>
      <p className="instruction-text">
        Enter a number below to find the top most popular species in each park that has a trail with popularity at least 6.
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
        ranking species.
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
        {results && results.length > 0 ? (
        <div>
            <Container style={flexFormat}>
      {results.map((result, index) =>
        // <Box
        //   key={result.species_id}
        //   p={3}
        //   m={2}
        //   style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        // >
        //     <h4>Scientific name: {result.scientific_name}</h4>
        //     <h5>Park name: {result.park_name}</h5>
        //     <h5>Rank: {result.ranks}</h5>
        // </Box>
        <StyledBox key={result.species_id}>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <StyledTableCell variant="head">Scientific name:</StyledTableCell>
              <StyledValueCell>{result.scientific_name}</StyledValueCell>
            </TableRow>
            <TableRow>
              <StyledTableCell variant="head">Park name:</StyledTableCell>
              <StyledValueCell>{result.park_name}</StyledValueCell>
            </TableRow>
            <TableRow>
              <StyledTableCell variant="head">Rank:</StyledTableCell>
              <StyledValueCell>{result.ranking}</StyledValueCell>
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

export default Section2;

