const mysql = require('mysql')
const config = require('./config.json')
const queries = require('./queries')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route: GET /
const index = async function (req, res) {
  res.send('Welcome to Park Safari!');
}

// Route: GET /parks
const parks = async function (req, res) {
  let sort = req.query.sort;
  let validSorts = ['park_name', 'acres', 'species_count'];
  if (!sort || !validSorts.includes(sort)) {
    sort = 'park_name';
  }
  connection.query(queries.allParks(sort), (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route: GET /species
const species = async function (req, res) {
  let parkName = req.query.park;
  connection.query(queries.allSpeciesAtPark(parkName), (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route: GET /random
const random = async function (req, res) {
  connection.query(`
    SELECT *
    FROM Park
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        park_code: data[0].park_code,
        park_name: data[0].park_name
      });
    }
  });
}

// Route: GET /recommended-airbnbs
const recommendedAirbnbs = async function (req, res) {
  const species = req.query.species;
  const num = req.query.num || 3; // default to 3 if num is not provided
  const state = req.query.state;

  if (state) {
    connection.query(queries.recommendedAirbnbInStateForSpecies(species, num, state), (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(queries.recommendedAirbnbForSpecies(species, num), (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// ROUTE: GET /most-biodiverse-airbnbs
const mostBiodiverseAirbnbs = async function (req, res) {
  const state = req.query.state;
  const neighbourhood = req.query.neighbourhood;
  const distance = req.query.distance || 100; // default to 100 if distance is not provided
  const num = req.query.num || 10; // default to 10 if num is not provided

  connection.query(queries.mostBiodiverseAirbnbs(state, neighbourhood, distance, num), (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route: GET /popular-species
const popularSpecies = async function (req, res) {
  const num = req.query.num || 10; // default to 10 if num is not provided

  connection.query(queries.popularSpecies(num), (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route: GET /species-for-photographers
const speciesForPhotographers = async function (req, res) {
  const num = req.query.num || 10; // default to 10 if num is not provided

  connection.query(queries.speciesForPhotographers(num), (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  index,
  parks,
  species,
  random,
  recommendedAirbnbs,
  mostBiodiverseAirbnbs,
  popularSpecies,
  speciesForPhotographers,
}
