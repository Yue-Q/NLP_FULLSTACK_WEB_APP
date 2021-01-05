import React from 'react';
import { 
  Button,
  Box,
  Link,
  Typography,
  Container
} from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Formik, Form, Field} from 'formik';
import * as yup from 'yup';
import Fade from 'react-reveal/Fade';
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
  link: {
    "&:hover": {
        color: "red",
        cursor: "context-menu",
    },
    fontWeight: 600,
    textDecoration: 'underline'

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

function Header(){
  return(
    <Typography component="h1" variant="h4">
      Reset Your Password
    </Typography>
  )
}

export default function ResetPassword(props) {  
  const classes = useStyles();
  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("Required")
  });

  const handleSubmit = async (values) => {
    const res = await APIRequest({
              url: `/user/resetPassword`,
              method: "PATCH",
              body: values,
              token: Auth.getToken()
            });
    const data = await res.json();
    if(data.message){
      alert(data.message)
    }else if(data.error){
      alert(data.error)
    }

  }

  return (
    <Container maxWidth="xs" className={classes.paper}>
        <Header className={classes.formTitle}/>
        <Formik
        initialValues={{
        password: ''
        }}

        onSubmit={async (values, {setSubmitting}) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 500);
          handleSubmit(values);
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
                    name="password"
                    type="text"
                    label="New Password"
                    autoFocus
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
                  Reset Password
                </StyledButton>
                </div>
                </Fade>
              </Form>
          )}
        </Formik>       
      </Container>
  );
  }

