import uuid
import pymongo
from functools import wraps
import pandas as pd
from passlib.hash import pbkdf2_sha256
# from predictionModel import PredictionModel
from flask_jwt import JWT, jwt_required, current_identity
from flask import Flask, jsonify, request, render_template, make_response, session, redirect

app = Flask(__name__, static_folder="./public/static", template_folder="./public")
app.secret_key = b'\x8a\xb4X\x87\x9d\xbd8\xb8Z \xae+2\x19\x8f\xa9'

#Database
try:       
    client = pymongo.MongoClient("mongodb+srv://singularitysystemUser:singularitysystem@cluster0.j9nsn.mongodb.net/test?retryWrites=true&w=majority")
    db = client.NLPApp
except:
    print("ERROR- Cannot connect to DB.")

#Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/')
    return wrap

####################################
#           Routes                 #
####################################
@app.route("/")
def home():
    return render_template('index.html')

#Register
@app.route("/user/signup", methods=["POST"])
def signup():
    try:
        # response = make_response()
        content = request.json
        user = {
            "_id":uuid.uuid4().hex,
            "firstName": content["firstName"],
            "lastName": content["lastName"],
            "middleName":content["middleName"],
            "email": content["email"],
            "phone": content["phone"],
            "mailAddress":content["mailAddress"],
            "occupation":content["occupation"],
            "userName":content["userName"],
            "password":content["password"] 
        }

        #Encrypt password
        user["password"] = pbkdf2_sha256.hash(user["password"])
        db.users.insert_one(user)

        #start session
        del user["password"]
        del user["_id"]
        session["logged_in"] = True
        session["user"] = user
        
        return jsonify({"result":user}),200
    except Exception as ex:
        print(ex)
        return jsonify({"error": "Signup faild"}),400
    
#check email
@app.route("/user/emailHasRegister", methods=["POST"])
def emailHasRegister():
    try:
        content = request.json
        if db.users.find_one({"email": content['email']}):

            return jsonify({"result":True}),200
        else :
            return jsonify({"result":False}),200
    except Exception as ex:
        print(ex)
        return jsonify({"error": "Input has some error!"}),400

#check username 
@app.route("/user/usernameHasRegister", methods=["POST"])
def userNameHasRegister():
    try:
        content = request.json
        if db.users.find_one({"userName": content['userName']}):
            return jsonify({"result":True}),200
        else :
            return jsonify({"result":False}),200
    except Exception as ex:
        print(ex)
        return jsonify({ "error": "usernameHasRegister input has some error!"}),400

#log in
@app.route("/user/login", methods=["POST"])
def login():
    try:
        content = request.json
        user = db.users.find_one({"userName": content['userName']})

        if user and pbkdf2_sha256.verify(content['password'], user['password']):
            del user["password"]
            del user["_id"]
            session["logged_in"] = True
            session["user"] = user
            return jsonify({"result":user}),200
        return jsonify({ "error": "Invalid login credentials" }), 401
    except Exception as ex:
        print(ex)
        

#log out
@app.route("/user/logout")
def logout():
        session.clear()
        return redirect('/')

#reset password
@app.route("/user/resetPassword", methods=['PATCH'])
def resetPassword():
    try:
        content = request.json
        newPassword = pbkdf2_sha256.hash(content["password"])
        res = db.users.update_one(
            {"userName": session['user']['userName']},
            {"$set":{"password": newPassword}}
        )
        if res.modified_count == 1:
            return jsonify({"message":"user updated"}),200
        else:
            return jsonify({"message":"Nothing to update"}),200
    except Exception as ex:
        print(ex)
        return jsonify({ "error": "Reset password failed" }), 401


@app.route("/notebook")
def notebook():
    return render_template('Notebook.html')

@app.route("/profile")
@login_required
def profile():
    return render_template('profile.html')


@app.route('/predict', methods=['POST'])
def predict():
    model = PredictionModel(request.json)
    return jsonify(model.predict())


@app.route('/random', methods=['GET'])
def random():
    data = pd.read_csv("data/fake_or_real_news_test.csv")
    index = randrange(0, len(data)-1, 1)
    return jsonify({'title': data.loc[index].title, 'text': data.loc[index].text})

# Only for local running
if __name__ == '__main__':
    app.run()
