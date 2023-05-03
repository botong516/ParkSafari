import '../App.css';
import { Form,Container,Button,Col,Row,Dropdown, DropdownButton, ButtonGroup, InputGroup} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import "./ParksPage.css";

const config = require('../config.json');

//this component is used to populate the card that shows the information about
// a park when the user clicks on a park in the table. The information includes
// details of the park, trails in the park, and airbnbs near the park.
const FloatingParkCard = ({ park, onClose }) => {
  const [trails, setTrails] = useState([]);
  const [airbnbs, setAirbnbs] = useState([]);

  useEffect(() => {
    if (park) {
      // Fetch trails for a park
      fetch(`http://${config.server_host}:${config.server_port}/trails?park=${park.park_code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Trails Data:", data);
          setTrails(data);
        });
      // Fetch airbnbs for a park
      fetch(`http://${config.server_host}:${config.server_port}/airbnbs?park_code=${park.park_code}`)
        .then((res) => res.json())
        .then(setAirbnbs);
    }
  }, [park]);

  return (
    <div className="floating-park-card-overlay">
      <div className="floating-park-card">
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Park details */}
        <h2>
          <span
            style={{
              fontFamily: 'Apple Chancery',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            {park.park_name}
          </span>
        </h2>
        <hr className="separator" />
        <p>
          Park Code:{' '}
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {park.park_code}
          </span>
        </p>
        <p>
          State:{' '}
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {park.state}
          </span>
        </p>
        <p>
          Acres:{' '}
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {park.acres}
          </span>
        </p>
        <p>
          Latitude:{' '}
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {park.latitude}
          </span>
        </p>
        <p>
          Longitude:{' '}
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {park.longitude}
          </span>
        </p>
        <div className="parkCardSections-container">
          <div className="parkCardSections">
            <h3>Trails</h3>
            {trails.map((trail) => (
              <span key={trail.trail_id} className="tag">
                {trail.trail_name}
              </span>
            ))}
          </div>
          <div className="vertical-separator"></div>
          <div className="parkCardSections">
            <h3>Airbnbs</h3>
            {airbnbs.map((airbnb) => (
              <span key={airbnb.id} className="tag">
                {airbnb.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};




const SearchPage = () => {

//store the park codes
const [data, setData] = useState([]);

//store the page size used by Datagrid
const [pageSize, setPageSize] = useState(10);

//stort the type of sort
const [sort, setSort] = useState('');

//store the search input
const [searchInput, setSearchInput] = useState('');

//store the type of search
const [searchBy, setSearchBy] = useState('Name');

//store the park id of the selected park
const [selectedParkId, setSelectedParkId] = useState(null);

//fetch the list of all parks with their details: state, acres, location, and species count
useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/parks`)
    .then(res => res.json())
    .then(resJson => {
      const parksWithId = resJson.map((park) => ({ id: park.park_code, ...park }));
      setData(parksWithId);
    });
}, []);

//search for parks by name, species, or state
const search = () => {
  fetch(`http://${config.server_host}:${config.server_port}/search?sort=${sort}` +
    `&searchBy=${searchBy}&searchTerm=${searchInput}`
  )
    .then(res => res.json())
    .then(resJson => {
      // create an array of objects with the park_code as the id which is unique 
      const parksWithId = resJson.map((park) => ({ id: park.park_code, ...park }));
      setData(parksWithId);
    });
}

//species the columns for the Datagrid
const columns = [
  { field: 'park_name', headerName: 'Park Name', width: 400, renderCell: (params) => (
      <Link onClick={() => setSelectedParkId(params.row)}>{params.value}</Link>
  ) },
  { field: 'state', headerName: 'State' },
  { field: 'acres', headerName: 'Acres' },
  { field: 'longitude', headerName: 'Longitude' },
  { field: 'latitude', headerName: 'Latitude' },
  { field: 'species_count', headerName: 'Species Count',width:200}
]

//change the sort type if user selects a different sort option
function handleSortChange(event) {
  setSort(event.target.value);
}

//change the search type if user selects a different search option
function handleSearchChange(event) {
  if(event.target.value === 'park')
  {
    setSearchBy('park_name');
  }
  else if(event.target.value === 'state')
  {
    setSearchBy('state');
  }
  else
  {
    setSearchBy('species');
  }
}

//change the search input if user searches with a different search input
function handleSearchContent(event) {
  setSearchInput(event.target.value);
}

return (

      <Container style={{paddingTop:'10px'}}>
      {selectedParkId && <FloatingParkCard park={selectedParkId} onClose={() => setSelectedParkId(null)} />}
      <Row>
        <Col sm='2'>
          <Container style={{marginTop:'0px'}} >
            <Row>
            <Form.Label>Search By:</Form.Label>
              <Form.Select className='mb-3' onChange={handleSearchChange}>
                <option value="park">Park Name</option>
                <option value="species">Species</option>
                <option value="state">State</option>
              </Form.Select>
            </Row>
            <Row>
            <Form.Label>Sort By:</Form.Label>
            <Form.Select onChange={handleSortChange}>
              <option value='park_name'>Name</option>
              <option value='acres'>Area</option>
              <option value='species_count'>Species Count</option>
            </Form.Select>
            </Row>

          </Container>
        </Col>
        <Col style={{marginTop:'31px'}}>
          <InputGroup>
            <Form.Control type="text" value={searchInput} placeholder="Search" onChange={handleSearchContent}/>
            <Button onClick={() => search() } onComp variant="outline-secondary" id="button-addon2" >
              Search
            </Button>
          </InputGroup>




        </Col>
      </Row>
      <h2 style={{marginTop:'10px'}}>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>

);
};

export default SearchPage;
