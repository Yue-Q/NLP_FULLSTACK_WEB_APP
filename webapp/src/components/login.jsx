import React from 'react';
import {
  Button,
  Grid,
  Box,
  Link as MUILink,
  Typography,
  Container
} from '@material-ui/core';
import {Link} from "react-router-dom";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from 'formik-material-ui';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Formik, Form, Field} from 'formik';
import * as yup from 'yup';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { APIRequest } from '../utils';
import Auth from '../modules/Auth.js';

const StyledButton = withStyles((theme) => ({
  root: {
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
    marginTop: theme.spacing(16),
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
  },
  errorLink: {
    "&:hover": {
        color: "red",
        cursor: "context-menu",
    },
    fontWeight: 600,
    textDecoration: 'underline'
  },
  link: {
    "&:hover": {
        color: "red",
        cursor: "context-menu",
    },
    textDecoration: 'underline'
  },
  linksContainer: {
    display: 'flex',
    flexDirection:'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
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


export default function LogIn(props) {
  // Redirect Auth

  const classes = useStyles();
  const [states, setStates] = React.useState({
    password: '',
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setStates({ ...states, showPassword: !states.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (values) => {
    const res = await APIRequest({
              url: `/user/login`,
              method: "POST",
              body: values,
            });
    const data = await res.json();
    if(data.token){
      Auth.signin(data.token);
      props.history.replace('/predict')
    }else if(data.error){
      alert(data.error)
    }

  }

//   const SERVER_URL = process.env.REACT_APP_SERVER_URL ?? "http://localhost:4000";

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("Required"),
      
    userName: yup
      .string()
      .required("Required")
  });

      return (
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <Formik
            initialValues={{
              userName: '',
              password: '',
            }}

            validateOnChange={false}
            validateOnBlur={false}
    
            onSubmit={async (values, {setSubmitting}) => {
              setTimeout(() => {
                setSubmitting(false);
              }, 500);
              handleLogin(values);
              
            }}
            validationSchema={validationSchema}
            >
            {({submitForm, isSubmitting, touched, errors}) => (
              <Form className={classes.form}>
                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    name="userName"
                    type="text"
                    label="Username"
                    autoFocus
                    fullWidth
                  />
                </Box>
                
                <Box margin={2}>
                <FormControl fullWidth>
                  <Field
                    component={TextField}
                    variant="outlined"
                    name="password"
                    type={states.showPassword ? 'text' : 'password'}
                    // value={states.password}
                    label="Password"
                    fullWidth
                    // onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {states.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>)
                    }}
                  />
                  </FormControl>
                </Box>
                
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <StyledButton
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                      fullWidth
                      className={classes.submit}
                    >
                  Log In
                </StyledButton>
                <Grid container>
                  <Grid item xs>
                    {/* <MUILink component={Link} to="/forgotPassword" variant="body2">
                      Forgot password?
                    </MUILink> */}
                  </Grid>
                  <Grid item>
                  <MUILink 
                    component={Link} 
                    variant="body2"
                    className={classes.errorLink} 
                    to={{
                      pathname: '/signup'
                    }}>
                      {"Don't have an account? Sign Up"}
                    </MUILink>
                  </Grid>
                </Grid>
              </Form>
            )}
            </Formik>       
          </div>
        </Container>
      );
    }


