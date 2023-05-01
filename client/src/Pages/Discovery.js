import React, { useState } from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../App.css';
import Section1 from "../Components/discovery_sec1";
import Section2 from "../Components/discovery_sec2";
import Section3 from "../Components/discovery_sec3";
import Section4 from "../Components/discovery_sec4";

const DiscoveryPage = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('section1');

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
    navigate(`${selectedKey}`);
  };

  return (
    <div className="discovery">
      <Container fluid>
        <Row>
          <Col sm={2}>
            <Tabs
              className="flex-column"
              activeKey={activeKey}
              onSelect={handleSelect}
            >
              <Tab eventKey="section1" title={<span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>Camera Havens</span>} />
              <Tab eventKey="section2" title={<span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>BioPop Trails</span>} />
              <Tab eventKey="section3" title={<span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>Top EcoFriendly Airbnbs</span>} />
              <Tab eventKey="section4" title={<span style={{fontFamily: "Apple Chancery", fontSize: '24px', fontWeight: 'bold'}}>Airbnbs Near Species Habitat</span>} />
            </Tabs>
          </Col>
          <Col sm={10}>
            <Routes>
              <Route index element={<Section1 />} />
              <Route path="section1" element={<Section1 />} />
              <Route path="section2" element={<Section2 />} />
              <Route path="section3" element={<Section3 />} />
              <Route path="section4" element={<Section4 />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DiscoveryPage;
