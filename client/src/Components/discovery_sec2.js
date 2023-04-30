import React, { useState, useEffect, useRef } from "react";
import "./discovery_sec.css";
import { Box, Container } from '@mui/material';

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

  const fetchData = async () => {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/popular-species?num=${inputValue}`);
    const data = await response.json();
    setResults(data);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

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
        species.
      </div>
        {results && results.length > 0 ? (
        <div>
            <Container style={flexFormat}>
      {results.map((result, index) =>
        <Box
          key={result.species_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
            <h4>Species: {result.common_names}</h4>
            <h5>Occurrence count: {result.occurrence_count}</h5>
        </Box>
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

