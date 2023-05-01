import '../App.css';
import { Form,Container,Button,Col,Row,Dropdown, DropdownButton, ButtonGroup, InputGroup} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');




const SearchPage = () => {

const [data, setData] = useState([]);
const [pageSize, setPageSize] = useState(10);
const [sort, setSort] = useState('');
const [stateLow, setStateLow] = useState('AK');
const [stateHigh, setStateHigh] = useState('WZ');
const [name, setName] = useState('');
const [species, setSpecies] = useState('');
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
  fetch(`http://${config.server_host}:${config.server_port}/parks?sort=${sort}` +
    `&state_low=${stateLow}&state_high=${stateHigh}` +
    `&name=${name}&species=${species}`
  )
    .then(res => res.json())
    .then(resJson => {
      // DataGrid expects an array of objects with a unique id.
      // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
      const parksWithId = resJson.map((park) => ({ id: park.park_code, ...park }));
      setData(parksWithId);
    }); setName(''); setSpecies(''); setStateLow('AK'); setStateHigh('WZ');
}

const columns = [
  { field: 'park_name', headerName: 'Park Name', width: 400, renderCell: (params) => (
      <Link onClick={() => setSelectedParkId(params.row.park_code)}>{params.value}</Link>
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
    setSearchBy('Name');
  }
  else if(event.target.value === 'species')
  {
    setSearchBy('Species');
  }
  else
  {
    setSearchBy('State');
  }
}

function handleSearchContent(event) {
  setSearchInput(event.target.value);
  
  if(searchBy === 'Name')
  {
    setName(event.target.value);
  }
  else if(searchBy === 'Species')
  {
    setSpecies(event.target.value);
  }
  else
  {
    setStateLow(event.target.value);
    setStateHigh(event.target.value);
  }
  
}

return (

      <Container style={{paddingTop:'10px'}}> 
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
