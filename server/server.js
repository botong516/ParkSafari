const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

//below is the list of routes that our application will use
app.get('/', routes.index)
app.get('/parks', routes.parks);
app.get('/species', routes.species);
app.get('/park/:park_code', routes.parkcode);
app.get('/search', routes.search);
app.get('/trails', routes.trails);
app.get('/airbnb', routes.airbnb);
app.get('/airbnbs', routes.airbnbs);
app.get('/random', routes.random);
app.get('/recommended-airbnbs', routes.recommendedAirbnbs);
app.get('/most-biodiverse-airbnbs', routes.mostBiodiverseAirbnbs);
app.get('/popular-species', routes.popularSpecies);
app.get('/species-for-photographers', routes.speciesForPhotographers);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
