# ParkSafari
Explore the biodiversity at the destination of your next journey! \
ParkSafari allows users who love nature and hiking to browse national parks and trails in the United States by the species they hope to see in the park. It can display the location and description of a list of popular national parks and allow the users to explore the different animals and plant species found in each park, including information about their abundance, scientific names, and levels of conservation. ParkSafari also allows users to search for trails within each park with filters for difficulty, length, popularity, etc. In addition, ParkSafari can display all the Airbnb listings in the vicinity of each National Park, providing users with convenient and appropriate accommodation options for their travel.

## List of Technologies
- MySQL Database
- Node.js with React
- Bootstrap Framework
- Jest testing framework

## Backend
Before running, create `config.json` with the following values:
```
{
  "rds_host": ...,
  "rds_port": ...,
  "rds_user": ...,
  "rds_password": ...,
  "rds_db": ...,
  "server_host": ...,
  "server_port": ...
}
```

To start the server, run `npm install` and `npm start`.

## Frontend
Make sure backend is running on the host and port specified in `config.json`.

To start the client, run `npm install` and `npm start`.
