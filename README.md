# Singularity System Inc. Coding Project 
## How to run this repo locally?
Clone the repo to your computer and go inside it and open two terminals here.

### Build the UI
1. In the first terminal, go inside the ui folder `webapp` using `cd ui`. 
2. Once inside the folder, run the command `npm install` to install all dependencies.
3. You can check the UI by runnning the command `npm start`, the browser should run on `localhost:3000`
> Note that the backend files will be the root folder of the project and the frontend will live in a subdirectory inside it with the name webapp.

### Build the service
On the second terminal, run the following commands:
1. We begin by creating a virtual environment using [virtualenv](https://towardsdatascience.com/python-virtual-environments-made-easy-fe0c603fe601) and Python 3 by running the command 
```
npm install virtualenv
virtualenv -p python venv
```
This command should build a new folder named *venv* in your project.

2. Activate the virtual env:
Windows: `source venv/Scripts/activate`
Mac: `source venv/bin/activate`

3. The install all the required dependencies using pip after activating the environment. 
```
pip install -r requirements.txt
```

4. Finally, we’ll run the Flask app.
```
FLASK_APP=app.py flask run
```
This will start up the service on 127.0.0.1:5000.

### Bundling
To bundle the frontend app and move it to the `/public` folder which the Flask app will serve, we will edit the `package.json` file:
```
"scripts": {
    "prebuild": "rm -r ../public",
    "build": "react-scripts build",
    "postbuild": "mv build/ ../public",
  }
```
**Now if you run npm run build inside `/webapp` folder then go up one directory
and run `python app.py` then visit http://localhost:5000 you will find the app up and running**

