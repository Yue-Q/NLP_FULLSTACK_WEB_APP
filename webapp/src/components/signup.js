import React from 'react';
import { Button, Link as MUILink, Grid, Box, Typography, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { TextField } from 'formik-material-ui';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Formik, Form, Field} from 'formik';
import * as yup from 'yup';
import Fade from 'react-reveal/Fade';
import { APIRequest } from '../utils';
import Auth from '../modules/Auth.js';

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

function SignupFormHeader(){
  return(
    <Typography component="h1" variant="h4">
      Create Your Account
    </Typography>
  )
}

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  lastName: yup
    .string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  middleName: yup
    .string()
    .max(15, "Too Long!"),
  email: yup
    .string()
    .required("Required")
    .email("Invalid Email"),
  phone: yup
    .string()
    .required("Required")
    .matches(
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
      "Invalid phone number"
    ),
  mailAddress: yup
    .string()
    .required("Required"),
  occupation: yup
    .string()
    .required("Required"),
  userName: yup
    .string()
    .required("Required"),
  password: yup
    .string()
    .required("Required")
});

async function validateEmail(value) {
  let error;
  const bodyContent = {email: value};
  const res = await APIRequest({
      url: `/user/emailHasRegister`,
      method: "POST",
      body: bodyContent,
  });
  const data = await res.json();
  if(data.result){
    error = "Email already exists!"
  }
  return error;
}

async function validateUsername(value) {
  let error;
  const bodyContent = {userName: value};
  const res = await APIRequest({
      url: `/user/usernameHasRegister`,
      method: "POST",
      body: bodyContent,
  });
  const data = await res.json();
  if(data.result){
    error = "Username already exists!"
  }
  return error;
}


export default function Signup(props) {  
    const classes = useStyles();
    let { from } = props.location.state || { from: { pathname: "/" } };

    const createUser = async (values) => {
      const res = await APIRequest({
                url: `/user/signup`,
                method: "POST",
                body: values,
      });
      const data = await res.json();
      if(data.token){
        Auth.signin(data.token);
        props.history.replace('/predict')
      }
    }

  return (
    <Container maxWidth="xs" className={classes.paper}>
        <SignupFormHeader className={classes.formTitle}/>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            middleName:'',
            email: '',
            phone: '',
            mailAddress:'',
            occupation:'',
            userName:'',
            password:'' 
          }}

          validateOnChange={false}
          validateOnBlur={false}

          onSubmit={(values, {setSubmitting}) => {
            setTimeout(() => {
              setSubmitting(false);
            }, 500);
            // alert(JSON.stringify(values, null, 2));
            createUser(values);
          //   props.createUser1(values);
          //   await props.sendCaptcha();
            // props.history.replace(from);
          }}
          validationSchema={validationSchema}
        >
        {({submitForm, isSubmitting, touched, errors}) => (
              <Form className={classes.form}>
                <Fade bottom cascade>
                  <div>
                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    name="firstName"
                    type="text"
                    label="First Name"
                    placeholder="Tom"
                    autoFocus
                    fullWidth
                  />
                </Box>
                <Box margin={2}>
                  <Field
                      component={TextField}
                      variant="outlined"
                      name="middleName"
                      type="text"
                      label="Middle Name"
                      placeholder="M."
                      fullWidth
                    />
                </Box>
                
                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    placeholder="Smith"
                    fullWidth
                  />
                </Box>

                {/* {isSubmitting && <LinearProgress />} */}
                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    type="email"
                    label="Email"
                    name="email"
                    placeholder="info@singularitysystem.com"
                    fullWidth
                    validate={validateEmail}
                  />
                </Box>

                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    type="text"
                    label="Phone Number"
                    name="phone"
                    placeholder="9018970908"
                    fullWidth
                  />
                </Box>

                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    type="text"
                    label="Mail Address"
                    name="mailAddress"
                    placeholder="47 W 13th St, New Jesery"
                    fullWidth
                  />
                </Box>

                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    type="text"
                    label="Occupation"
                    name="occupation"
                    placeholder="Student"
                    fullWidth
                  />
                </Box>

                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    type="text"
                    label="User Name"
                    name="userName"
                    placeholder="toms"
                    validate={validateUsername}
                    fullWidth
                  />
                </Box>

                <Box margin={2}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    type="text"
                    label="Password"
                    name="password"
                    fullWidth
                  />
                </Box>
                
                    <StyledButton
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                      fullWidth
                      className={classes.submit}
                    >
                      Submit
                    </StyledButton>
                    <Grid container style={{justifyContent: "flex-end"}}>
                      <Grid item>
                        <MUILink 
                          component={Link} 
                          to={{
                            pathname: '/login',
                            state: { from }
                          }} 
                          variant="body2" 
                          className={classes.link}>
                          {"Already have an account? Sign In!"}
                        </MUILink>
                      </Grid>
                    </Grid>
                  
                </div>
                </Fade>
              </Form>
          )}
        </Formik>       
      </Container>
  );
  }
