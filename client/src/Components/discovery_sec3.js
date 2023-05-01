import React, { useState, useEffect, useRef } from "react";
import "./discovery_sec.css";
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/system';

const config = require('../config.json');
const Section3 = () => {
  const [state, setState] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [distance, setDistance] = useState("");
  const [num, setNum] = useState("");
  const [results, setResults] = useState([]);
  const stateRef = useRef();

  useEffect(() => {
    stateRef.current.focus();
  }, []);

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleNeighbourhoodChange = (e) => {
    setNeighbourhood(e.target.value);
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleNumChange = (e) => {
    setNum(e.target.value);
  };

  const fetchData = async () => {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/most-biodiverse-airbnbs?state=${state}&neighbourhood=${neighbourhood}&distance=${distance}&num=${num}`);
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
      <h2>Discover Top Airbnbs With High Species Count</h2>
      <p className="instruction-text">
        In a specific state and neighbourhood, get the top Airbnbs that have the highest species count from parks within [x] miles of radius from it.
      </p>
      <div className="input-container">
        State:{" "}
        <input
          type="text"
          ref={stateRef}
          value={state}
          onChange={handleStateChange}
          onKeyPress={handleKeyPress}
          className="text-input"
        />{" "}
        Neighbourhood:{" "}
        <input
          type="text"
          value={neighbourhood}
          onChange={handleNeighbourhoodChange}
          onKeyPress={handleKeyPress}
          className="text-input"
        />{" "}
        Distance:{" "}
        <input
          type="number"
          value={distance}
          onChange={handleDistanceChange}
          onKeyPress={handleKeyPress}
          className="number-input"
          style={{ width: `${50 + distance.length * 10}px`, margin: "10 10px" }}
        />{" "}
        miles. Get top{" "}
        <input
          type="number"
          value={num}
          onChange={handleNumChange}
          onKeyPress={handleKeyPress}
          className="number-input"
          style={{ width: `${50 + num.length * 10}px`, margin: "10 10px" }}
        />{" "}
        Airbnbs.
        <button onClick={fetchData}>Search</button>
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
                        <StyledTableCell variant="head">Reviews/mo:</StyledTableCell>
                        <StyledValueCell>{result.reviews_per_month}</StyledValueCell>
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

export default Section3;