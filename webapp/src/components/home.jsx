import React from 'react';
import {Button} from '@material-ui/core';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const StyledButton = withStyles((theme) => ({
    root: {
      color: "white",
      backgroundColor: '#ef3e3d',
      borderRadius: '300px',
      "&:hover": {
        opacity: '0.5',
        backgroundColor: '#ef3e3d'
     },
    }
  }))(Button);
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(10),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
  
    buttonWrappers: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-around",
      
      
    },
  
    link: {
      "&:hover": {
          color: "red",
          cursor: "context-menu",
       }
    }
  }));
  
  const Home = (props) => {
    const classes = useStyles();
    return(
      <container maxWidth="xs" className={classes.paper}>
        <div><h1>Welcome to my project!</h1></div>
        <div className={classes.buttonWrappers}>
            <StyledButton variant="contained" fullwidth><Link classes={classes.link} style={{ textDecoration: 'none' }} to="/signup">Sign Up</Link></StyledButton>
            <StyledButton variant="contained" fullwidth><Link classes={classes.link} style={{ textDecoration: 'none' }} to="/login">Log In</Link></StyledButton>
        </div>
        
      </container>
    )
  }
  
  export default Home