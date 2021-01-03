import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import Profile from './profile';


export default function Predict(props){
   const [states, setStates]=React.useState({
        isLoading: false,
        formData: {
            textfield1: '',
            textfield2: '',
            select1: 1,
            select2: 1,
            select3: 1
        },
        result: ""
   })
       
    
    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        var formData = states.formData;
        formData[name] = value;
        setStates({
          ...states,
          formData
        });
      }
    
    const handlePredictClick = (event) => {
        const formData = states.formData;
        setStates({ ...states, isLoading: true });
        fetch('/prediction/', 
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(response => {
            setStates({
              ...states,
              result: response.result,
              isLoading: false
            });
          });
      }
    
      const handleCancelClick = (event) => {
        setStates({ ...states, result: "" });
      }
    return(
        <Container>
          <Profile />
        <div>
          <h1 className="title">ML React App</h1>
        </div>
        <div className="content">
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Text Field 1</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Text Field 1" 
                  name="textfield1"
                  value={states.formData.textfield1}
                  onChange={() => handleChange} />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Text Field 2</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Text Field 2" 
                  name="textfield2"
                  value={states.formData.textfield2}
                  onChange={() => handleChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Select 1</Form.Label>
                <Form.Control 
                  as="select"
                  value={states.formData.select1}
                  name="select1"
                  onChange={() => handleChange}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Select 2</Form.Label>
                <Form.Control 
                  as="select"
                  value={states.formData.select2}
                  name="select2"
                  onChange={() => handleChange}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Select 3</Form.Label>
                <Form.Control 
                  as="select"
                  value={states.formData.select3}
                  name="select3"
                  onChange={() => handleChange}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Row>
              <Col>
                <Button
                  block
                  variant="success"
                  disabled={states.isLoading}
                  onClick={() => !states.isLoading ? handlePredictClick : null}>
                  { states.isLoading ? 'Making prediction' : 'Predict' }
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  disabled={states.isLoading}
                  onClick={() => handleCancelClick}>
                  Reset prediction
                </Button>
              </Col>
            </Row>
          </Form>
          {states.result === "" ? null :
            (<Row>
              <Col className="result-container">
                <h5 id="result">{states.result}</h5>
              </Col>
            </Row>)
          }
        </div>
      </Container>
    )
}