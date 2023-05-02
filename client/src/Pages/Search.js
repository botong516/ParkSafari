import '../App.css';
import { Form,Container,Button,Col,Row,Dropdown, DropdownButton, ButtonGroup, InputGroup} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import "./ParksPage.css";

const config = require('../config.json');

// const FloatingParkCard = ({ park, onClose }) => {
//   return (
//     <div className="floating-park-card-overlay">
//       <div className="floating-park-card">
//         {/* Close button */}
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>

//         {/* Park details */}
//         <h2><span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>{park.park_name}</span></h2>
//         <hr className="separator" />
//         <p>Park Code: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.park_code}</span></p>
//         <p>State: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.state}</span></p>
//         <p>Acres: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.acres}</span></p>
//         <p>Latitude: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.latitude}</span></p>
//         <p>Longitude: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.longitude}</span></p>
//       </div>
//     </div>
//   );
// };

const FloatingParkCard = ({ park, onClose }) => {
  const [trails, setTrails] = useState([]);
  const [airbnbs, setAirbnbs] = useState([]);

  useEffect(() => {
    if (park) {
      fetch(`http://${config.server_host}:${config.server_port}/trails?park=${park.park_code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Trails Data:", data);
          setTrails(data);
        });

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

const [data, setData] = useState([]);
const [pageSize, setPageSize] = useState(10);
const [sort, setSort] = useState('');
const [searchInput, setSearchInput] = useState('');
const [searchBy, setSearchBy] = useState('Name');
const [selectedParkId, setSelectedParkId] = useState(null);


useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/parks`)
    .then(res => res.json())
    .then(resJson => {
      const parksWithId = resJson.map((park) => ({ id: park.park_code, ...park }));
      setData(parksWithId);
      console.log(parksWithId)
    });
}, []);


const search = () => {
  fetch(`http://${config.server_host}:${config.server_port}/search?sort=${sort}` +
    `&searchBy=${searchBy}&searchTerm=${searchInput}`
  )
    .then(res => res.json())
    .then(resJson => {
      // DataGrid expects an array of objects with a unique id.
      // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
      const parksWithId = resJson.map((park) => ({ id: park.park_code, ...park }));
      setData(parksWithId);
    });
}

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

function handleSortChange(event) {
  setSort(event.target.value);
}

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

function handleSearchContent(event) {
  setSearchInput(event.target.value);
}

// const FloatingParkCard = ({ park, onClose }) => {
//   return (
//     <div className="floating-park-card-overlay">
//       <div className="floating-park-card">
//         {/* Close button */}
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>

//         {/* Park details */}
//         <h2><span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>{park.park_name}</span></h2>
//         <hr className="separator" />
//         <p>Park Code: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.park_code}</span></p>
//         <p>State: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.state}</span></p>
//         <p>Acres: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.acres}</span></p>
//         <p>Latitude: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.latitude}</span></p>
//         <p>Longitude: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.longitude}</span></p>
//         <p>Number of Species: <span style={{fontSize: '20px', fontWeight: 'bold'}}>{park.species_count}</span></p>
//       </div>
//     </div>
//   );
// };

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
      {selectedParkId && (
        <FloatingParkCard
          park={selectedParkId}
          onClose={() => setSelectedParkId(null)}
        />
      )}
    </Container>

);
};

export default SearchPage;
