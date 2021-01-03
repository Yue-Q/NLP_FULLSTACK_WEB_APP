import React from 'react';
import { Button, Link } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { APIRequest } from '../utils';

// const SERVER_URL = "http://localhost:5000";

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
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formTitle: {
    "justify":"center",
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    root:{
      "&hover": {
        opacity: 0.3,
          backgroundColor: '#ef3e3d'
      }
    }
  },
  button: {
    root:{
      "&hover": {
        opacity: 0.3,
          backgroundColor: '#ef3e3d'
      }
    }
  }
  
}));




export default function Profile(props) {  
  const classes = useStyles();

  async function handleSignout() {
    await APIRequest({
        url: `/user/logout`,
        method: "GET"
    })
  }

  return (
    <div style={{display:"flex",flexDirection:'row', justifyContent:'space-around'}}>
        <StyledButton>
            <Link href="/profile">Profile</Link>
        </StyledButton>

    </div>
  );
  }
