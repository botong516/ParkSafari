import '../App.css';
import { Form,Container,Button,Col,Row,Dropdown, DropdownButton, ButtonGroup, InputGroup} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');




const SearchPage = () => {

const [data, setData] = useState([]);
const [pageSize, setPageSize] = useState(10);
const [sort, setSort] = useState('');
const [state, setState] = useState(['AK','WZ']);
const [selectedParkId, setSelectedParkId] = useState(null);


useEffect(() => {
  fetch(`http://${config.server_host}:${config.server_port}/parks`)
    .then(res => res.json())
    .then(resJson => {
      const parksWithId = resJson.map((park) => ({ id: park.park_code, ...park }));
      setData(parksWithId);
    });
}, []);


const search = () => {
  fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
    `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
    `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
    `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
    `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
    `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
    `&explicit=${explicit}`
  )
    .then(res => res.json())
    .then(resJson => {
      // DataGrid expects an array of objects with a unique id.
      // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
      const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
      setData(songsWithId);
    });
}

return (
  
      <Container style={{paddingTop:'10px'}}> 
      <Row>
        <Col sm='2'>
          <Container style={{marginTop:'0px'}} >
            <Row>
            <Form.Label>Search By:</Form.Label>
              <Form.Select className='mb-3'>
                <option value="search1">Park Name</option>
                <option value="search2">Species</option>
                <option value="search3">State</option>
              </Form.Select>
            </Row>
            <Row>
            <Form.Label>Sort By:</Form.Label>
            <Form.Select>
              <option value="1">Area</option>
              <option value="2">Species Count</option>
            </Form.Select>
            </Row>
            
          </Container>
        </Col>
        <Col style={{marginTop:'31px'}}>
          <InputGroup>
            <Form.Control type="text" placeholder="Search" />
            <Button variant="outline-secondary" id="button-addon2" >
              Search
            </Button>
          </InputGroup>

            
        
        
        </Col>
      </Row>
      <h2>Results</h2>
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
