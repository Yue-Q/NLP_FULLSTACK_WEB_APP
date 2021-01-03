import json


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
        "userName":"tomtest1",
        "password":"123" 
    }
    url = '/user/signup'

    res = client.post(url, data=json.dumps(data), headers=headers)

    assert res.content_type == mimetype
    assert res.status_code == 200
    assert json.loads(res.get_data(as_text=True))["result"]["email"] == "tom@gmail.com"

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
    data = {"userName": "tomtest1", "password":"123"}
    url = '/user/login'

    res = client.post(url, data=json.dumps(data), headers=headers)

    assert res.content_type == mimetype
    assert res.status_code == 200
    assert json.loads(res.get_data(as_text=True))["result"]["email"] == "tom@gmail.com"