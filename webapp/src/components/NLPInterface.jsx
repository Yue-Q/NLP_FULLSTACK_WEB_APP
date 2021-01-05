import React from 'react';
import ReactDOM from 'react-dom';
// import { Pipeline } from '../pipeline'
import './index.scss';
import {Button, Container,Link} from '@material-ui/core';


export default class NLPInterface extends React.Component {
  state = { 
    // Initially, no file is selected 
    selectedFile: null,
    selectedFileContent: null,
    prediction: null,
    loading: false,
    error: false
  }; 

  // On file select (from the pop up) 
  onFileChange = event => { 
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      // The file's text will be printed here
      // console.log(event.target.result);
      this.setState({ selectedFileContent: event.target.result }); 
    };
    // Update the state 
    this.setState({ selectedFile: event.target.files[0] }); 
    reader.readAsText(file);
  }; 

  // File content to be displayed after 
    // file upload is complete 
    fileData = () => { 
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p><strong>File Name:</strong> {this.state.selectedFile.name}</p> 
            <p><strong>File content:</strong><br />
            {this.state.selectedFileContent}</p>
            
          </div> 
        ); 
      }
    }; 


  // random = () => fetch("/random")
  //   .then(response => response.json())
  //   .then(article => article.title + '\n\n' + article.text)
  //   .then(text => this.setState({
  //     text, wordsHint: this.getWordsHint(text), prediction: null,
  //     original: null,
  //     pos_tagged: null,
  //     preprocessed: null,
  //     emoji: false
  //   }))
  //   .catch(error => this.setState({ error: true, emoji: false }));

  // updateInput = ({ target: { value } }) => this.setState({ text: value, prediction: null, wordsHint: this.getWordsHint(value) });

  // getWordsHint = (text) => {
  //   let count = text.split(/\s/).length;
  //   if (count < this.MIN_WORDS) return `You have to write ${this.MIN_WORDS - count} more words`
  //   if (count >= this.MIN_WORDS) return `You can write up to ${this.MAX_WORDS - count} more words`
  // }
  predict = () => {
    this.setState({ loading: true, prediction: null });

    fetch("/predict", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.selectedFileContent)
    })
      .then(response => response.json())
      .then(({ prediction }) => {
        this.setState({ loading: false, prediction })
      })
      .catch(error => this.setState({ loading: false, error: true }))

  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        
        <h1><Link onClick={() => this.props.history.push("/profile")}>Go to profile page</Link></h1>
        <h1>NLP Fake News Classifier</h1>
        <h3>Step 1. Upload your text file:</h3>
          <Button variant="contained" component="label" color="primary" style={{marginRight:"10px", marginBottom: "10px"}}>Upload File
            <input type="file" hidden onChange={this.onFileChange}/>
          </Button>
        
        {this.fileData()}
        <h3>Step 2. Predict:</h3>
          <Button variant="contained" color="primary" onClick={() => alert("Coming soon!")}> Predict </Button>
    
        {this.state.loading ? <h1>Classifying ...</h1> : ''}
        {this.state.error ? <h1>ERROR</h1> : ''}
        <h1>{this.state.prediction}</h1>
      </Container>
    )
    }
}



ReactDOM.render(
  <NLPInterface />,
  document.getElementById('root'));
