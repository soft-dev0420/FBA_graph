import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const DetailPage = () => {
  const {selectedRow} = useSelector((state)=>state.excel);

  return <div>
    <Row>
      <Col xl={3}>
        <img src= {selectedRow['Image URL']}/>
      </Col>
    </Row>
  </div>
};

export default DetailPage;