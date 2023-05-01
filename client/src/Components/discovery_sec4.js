import React, { useState, useEffect, useRef } from "react";
import "./discovery_sec.css";
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/system';

const config = require('../config.json');
const Section4 = () => {
  const [species, setSpecies] = useState("");
  const [num, setNum] = useState("");
  const [state, setState] = useState("");
  const [results, setResults] = useState([]);
  const stateRef = useRef();

  useEffect(() => {
    stateRef.current.focus();
  }, []);

  const handleSpeciesChange = (e) => {
    setSpecies(e.target.value);
  };

  const handleNumChange = (e) => {
    setNum(e.target.value);
  };

  const fetchData = async () => {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/recommended-airbnbs?species=${species}&num=${num}&state=${state}`);
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
      <h2>Discover Top Airbnbs Near Species Habitat</h2>
      <p className="instruction-text">
      For each park where a specific species can be found, get the top 3 best-valued Airbnbs 
      that are the closest to the park. (Best-valued listing is defined as the Airbnb
      that is the closest and has at least 150 user reviews.)
      </p>
      <div className="input-container">
        Species:{" "}
        <input
          type="text"
          ref={stateRef}
          value={species}
          onChange={handleSpeciesChange}
          className="text-input"
        />{" "}
        . Get top{" "}
        <input
          type="number"
          value={num}
          onChange={handleNumChange}
          className="number-input"
          style={{ width: `${50 + num.length * 10}px`, margin: "10 10px" }}
        />{" "}
        ranking Airbnbs near{" "}
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="text-input"
          style={{ width: `${50 + state.length * 10}px` }}
        />{" "}.{" "}
        <br />
        <br />
        <div className="button-container">
        <button onClick={fetchData}>Search</button>
        </div>
      </div>
      {results && results.length > 0 ? (
        <div>
          <Container style={flexFormat}>
            {results.map((result, index) => (
              <StyledBox key={result.id}>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <StyledTableCell variant="head">Airbnb name:</StyledTableCell>
                        <StyledValueCell>{result.name}</StyledValueCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell variant="head">Price:</StyledTableCell>
                        <StyledValueCell>{result.price}</StyledValueCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell variant="head">Distance to park:</StyledTableCell>
                        <StyledValueCell>{result.distance_to_park}</StyledValueCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledBox>
            ))}
          </Container>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Section4;