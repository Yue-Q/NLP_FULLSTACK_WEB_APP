import React, { useState, useEffect } from 'react';
import { 
  Button,
  Container,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { APIRequest } from '../utils';
import Auth from '../modules/Auth.js';

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
  }  
}));

const CustomizedTableRow = (props) => {
  return(
    <TableRow>
      <TableCell component="th" scope="row">
        {props.title}:
      </TableCell>
      <TableCell>{props.value}</TableCell>
    </TableRow>
  )
}

export default function Profile(props) {  
  const classes = useStyles();
  const [user, setUser] = useState({});

  const getUserInfo = async () => {
    try {
      const res = await APIRequest({
        url: '/user/fetchUserInfo',
        method: "GET",
        token: Auth.getToken()
      });
      const data = await res.json();
      console.log(data.user);
      setUser(data.user);
    } catch (err) {
      console.error(err.message);
    }
  };
 
  useEffect(() => {
    getUserInfo();
  },[]);
  // const [user, setUser] = useState({
  //   userName:"test1",
  //   firstName:"Yue",
  //   middleName:"M.",
  //   lastName:"Qiu",
  //   occupation:"Student",
  //   email:"test@gamil.com",
  //   mailAddress:"995 Jefferson Commons Circle"
  // });


  return (
    <Container maxWidth="xs" className={classes.paper}>
      <h1>
        User Information
      </h1>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <CustomizedTableRow title="Username" value={user.userName} />
          <CustomizedTableRow title="Full Name" value={`${user.firstName} ${user.middleName} ${user.lastName}`} />
          <CustomizedTableRow title="Occupation" value={user.occupation} />
          <CustomizedTableRow title="Email" value={user.email} />
          <CustomizedTableRow title="Mail Address" value={user.mailAddress} />
        </TableBody>
      </Table>
      </TableContainer>
      <Grid container spacing={2} style={{marginTop: "10px"}}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={() => props.history.push('/resetPassword')} fullWidth>Reset Password</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="secondary" onClick={() => {Auth.signout();props.history.replace('/')}} fullWidth>Sign Out</Button>
          </Grid>

      </Grid>
    </Container>
  );
  }
