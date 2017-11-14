'use strict';

const request = require('superagent'); //a client
const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');
const service = 'localhost:3000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/auth_test';
process.env.SECRET = 'testsecret';
const server = require(__dirname + '/../server');

beforeAll(() => {
  server.start();
  return User.remove({});
});

afterAll(() => {
  User.remove({});
  return server.stop();
});


describe('POST /signup', () => {

  it('should respond with a 400, if no request body has been provided or the body is invalid', () => {
    return request
    .post('localhost:3000/signup')
    .send({u:'a'})
    .catch(res => {
      expect(res.status).toEqual(400);
    });
  });

  User.remove({});

  it('should be able to create a user', () => {
    return request
    .post('localhost:3000/signup')
    .send({username:'test', password:'testPassword', email:'test@gmail.com'})
    .then(res => {
      let decoded = jwt.verify(res.text, 'testsecret');
      expect(decoded.id.length).not.toBe(0);
      return User.findOne({username: 'test'})
      .then(user => expect(user._id.toString()).toEqual(decoded.id));
    });
  });
});

describe('GET /signin', () => {
  it('should respond with a 200, for valid requests made with a valid id, returns a valid body, which is the token', () => {

    let basicToken = new Buffer(`test:testPassword`).toString('base64');
    console.log(`basicToken: `, basicToken);
    let url = `http://${service}/signin`;
    return request
    .get(url)
    .set('Authorization', `Basic ${basicToken}`)
    .then(res => {
      expect(res.status).toEqual(200);
      expect(res.text).not.toBe(null);
    });
  });

  it('should respond with a 403, if no basic token was provided', () => {
    return request
    .get('http://localhost:3000/signin')
    //I changed the last character of the correct basicToken to generate a bad basicToken
    //correct token:    dGVzdDp0ZXN0UGFzc3dvcmQ=
    //incorrect token:  dGVzdDp0ZXN0UGFzc3dvcmQ+
    .set('Authorization', `Basic dGVzdDp0ZXN0UGFzc3dvcmQ+`)
    .catch(res => {
      expect(res.status).toEqual(403);
    });
  });
});

describe('GET /showMyAccount', () => {

  it('should respond with 200 for a get request with a valid basic authorization header and send a valid body back as a response', () => {
    let myJWT = '';
    let basicToken = new Buffer(`test:testPassword`).toString('base64');
    let signinurl = `http://${service}/signin`;
    request
    .get(signinurl)
    .set('Authorization', `Basic ${basicToken}`)
    .then((res) => {
      myJWT = res.text;
      console.log(`myJWT: `, myJWT);
      let url = `http://${service}/showMyAccount`;
      return request
      .get(url)
      .set('Authorization', 'Bearer ' + myJWT)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).not.toBe(null);
        console.log('res.text showMyAccount: ' + res.text);
      });

    });
  });
});

describe('GET /signin', () => {
  it('should be able to sign in a user', () => {
    return request
    .get('localhost:3000/signin')
    .auth('test', 'testPassword')
    .then(res => {
      let decoded = jwt.verify(res.text, 'testsecret');
      expect(decoded.id.length).not.toBe(3);
      return User.findOne({username: 'test'})
      .then(user => expect(user._id.toString()).toEqual(decoded.id) );
    });
  });
});
