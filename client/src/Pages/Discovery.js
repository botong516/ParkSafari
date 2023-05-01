import React, { useState } from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../App.css';

const Section1 = () => <div className="discovery-content">Section 1 Content</div>;
const Section2 = () => <div className="discovery-content">Section 2 Content</div>;
const Section3 = () => <div className="discovery-content">Section 3 Content</div>;
const Section4 = () => <div className="discovery-content">Section 4 Content</div>;

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
              <Tab eventKey="section1" title="Section 1" />
              <Tab eventKey="section2" title="Section 2" />
              <Tab eventKey="section3" title="Section 3" />
              <Tab eventKey="section4" title="Section 4" />
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
