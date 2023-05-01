import React, { useState, useEffect } from "react";


function TestPage() {
  const [randomNumber, setRandomNumber] = useState(null);
  const config = require('config.json');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => {
        setRandomNumber(resJson.number);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      {randomNumber ? (
        <p>The random number is: {randomNumber}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TestPage;
