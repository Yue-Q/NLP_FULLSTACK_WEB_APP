import React from 'react';
import ReactDOM from 'react-dom';
import { Pipeline } from '../pipeline'
import axios from 'axios'; 
import './index.scss';
import Profile from './profile';
import {Button, Container,Link} from '@material-ui/core';


export default class NLPInterface extends React.Component {
  state = { 
    // Initially, no file is selected 
    selectedFile: null,
    selectedFileContent: null
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

  // On file upload (click the upload button) 
  onFileUpload = () => { 
     
    // Create an object of formData 
    const formData = new FormData(); 
   
    // Update the formData object 
    formData.append( 
      "myFile", 
      this.state.selectedFile, 
      this.state.selectedFile.name,
      this.state.selectedFile.file,
    ); 
   
    // Details of the uploaded file 
    console.log(this.state.selectedFile.file); 
   
    // Request made to the backend api 
    // Send formData object 
    axios.post("api/uploadfile", formData); 
  }; 

  // File content to be displayed after 
    // file upload is complete 
    fileData = () => { 
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p><strong>File Name:</strong> {this.state.selectedFile.name}</p> 
            <p><strong>File Type:</strong> {this.state.selectedFile.type}</p> 
            <p><strong>File content:</strong><br />
            {this.state.selectedFileContent}</p>
            
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Choose before Pressing the Upload button</h4> 
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
  // predict = () => {
  //   if (this.MAX_WORDS - this.state.text.split(/\s/).length < 0) return;

  //   this.setState({ loading: true, prediction: null });

  //   fetch("/predict", {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(this.state.text)
  //   })
  //     .then(response => response.json())
  //     .then(({ original, pos_tagged, preprocessed, prediction }) => {
  //       this.setState({ loading: false, prediction, original, pos_tagged, preprocessed })
  //     })
  //     .catch(error => this.setState({ loading: false, error: true }))

  // }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Button variant="contained" style={{marginTop:"5px"}}><Link href="/profile">Profile</Link></Button>
        <h1>NLP Fake News Classifier</h1>
        <div> 
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={this.onFileChange}
                  />
                </Button>
                 
        </div> 
        {this.fileData()} 
       

        <Button variant="outlined" onClick={() => alert("Coming soon!")}> Predict </Button>

        {this.state.loading ? <h1>Classifying ...</h1> : ''}

        {this.state.error ? <h1>ERROR</h1> : ''}

        <h1 className={this.state.prediction}>
          {this.state.prediction}
        </h1>
      </Container>
    )
    }
}



ReactDOM.render(
  <NLPInterface />,
  document.getElementById('root'));
