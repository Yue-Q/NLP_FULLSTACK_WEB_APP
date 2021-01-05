import json
import jwt
import datetime

###################################
#        Test public APIs         #
###################################
def test_signup(app, client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data = {
        "_id": "000001",
        "firstName": "Tom",
        "lastName": "Ford",
        "middleName":"M.",
        "email": "tom@gmail.com",
        "phone": "6784329482",
        "mailAddress":"996 Jefferson Commons, New York, 55412",
        "occupation":"Student",
        "userName":"test1",
        "password":"test1" 
    }
    url = '/user/signup'
    res = client.post(url, data=json.dumps(data), headers=headers)

    jwt_options = {
                    'verify_signature': True,
                    'verify_exp': True,
                    'verify_nbf': False,
                    'verify_iat': True,
                    'verify_aud': False
                }
    token = json.loads(res.get_data(as_text=True))["token"]
    app.secret_key = b'\x8a\xb4X\x87\x9d\xbd8\xb8Z \xae+2\x19\x8f\xa9'
    expected = jwt.decode(jwt=token, key=app.secret_key, algorithms=["HS256"], options=jwt_options)["userName"]
    assert res.content_type == mimetype
    assert res.status_code == 200
    assert expected == data["userName"]

def test_emailHasRegister(app, client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data = {"email": "tom@gmail.com"}
    url = '/user/emailHasRegister'

    res = client.post(url, data=json.dumps(data), headers=headers)

    assert res.content_type == mimetype
    assert res.status_code == 200
    expected = {"result":True}
    assert expected == json.loads(res.get_data(as_text=True))

def test_login(app, client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data = {"userName": "test1", "password":"test1"}
    data_invalid = {"userName": "test1", "password":"test2"}
    url = '/user/login'
    res = client.post(url, data=json.dumps(data), headers=headers)
    res_invalid = client.post(url, data=json.dumps(data_invalid), headers=headers)


    jwt_options = {
                    'verify_signature': True,
                    'verify_exp': True,
                    'verify_nbf': False,
                    'verify_iat': True,
                    'verify_aud': False
                }
    error_msg = json.loads(res_invalid.get_data(as_text=True))["error"]
    token = json.loads(res.get_data(as_text=True))["token"]
    app.secret_key = b'\x8a\xb4X\x87\x9d\xbd8\xb8Z \xae+2\x19\x8f\xa9'
    expected = jwt.decode(jwt=token, key=app.secret_key, algorithms=["HS256"], options=jwt_options)["userName"]
    assert res.content_type == mimetype
    assert res.status_code == 200
    assert res_invalid.status_code == 401
    assert error_msg == "Invalid login credentials"
    assert expected == data["userName"]

###################################
#    Test tokend_required APIs    #
###################################
def test_fetchUserInfo(app, client):
    mimetype = 'application/json'
    user = {
        "firstName": "Tom",
        "lastName": "Ford",
        "middleName":"M.",
        "email": "tom@gmail.com",
        "phone": "6784329482",
        "mailAddress":"996 Jefferson Commons, New York, 55412",
        "occupation":"Student",
        "userName":"test1",
    }

    payload = user
    payload["exp"] = datetime.datetime.utcnow()+datetime.timedelta(minutes=2)
    token = jwt.encode(payload=payload,key=app.secret_key,algorithm="HS256")

    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'x-access-token': token
    }
    
    url = '/user/fetchUserInfo'
    res = client.get(url, headers=headers)
    expected = user["userName"]
     
    assert res.content_type == mimetype
    assert res.status_code == 200
    assert expected == json.loads(res.get_data(as_text=True))["user"]["userName"]

def test_resetPassword(app, client):
    mimetype = 'application/json'
    user = {
        "userName":"test1"
    }

    payload = user
    payload["exp"] = datetime.datetime.utcnow()+datetime.timedelta(minutes=2)
    token = jwt.encode(payload=payload,key=app.secret_key,algorithm="HS256")

    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'x-access-token': token
    }
    
    url = '/user/resetPassword'
    body = {"password":"new password"}
    res = client.patch(url, data=json.dumps(body), headers=headers)
    expected = "user updated"
     
    assert res.content_type == mimetype
    assert res.status_code == 200
    assert expected == json.loads(res.get_data(as_text=True))["message"]

    body_2 = {"password":"test1"}
    res_2 = client.patch(url, data=json.dumps(body_2), headers=headers)
    assert res_2.status_code == 200
