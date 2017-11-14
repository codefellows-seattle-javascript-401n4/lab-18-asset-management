'use strict';

const request = require('superagent');
const User = require(__dirname + '/../models/user');
const Order = require(__dirname + '/../models/order');
const service = 'localhost:3000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/order_test';
process.env.SECRET = 'testsecret';
const server = require(__dirname + '/../server');

beforeAll(() => {
  server.start();
  User.remove({});
  Order.remove({});
});

afterAll(() => {
  server.stop();
  return User.remove({});
});

let generatedToken = '';
let userID = '';

beforeEach(() => {

  const password = 'testPassword';

  return (new User({username:'testUsername', email:'testUsername@gmail.com'})).generateHash(password)
  .then((user) => {
    generatedToken = user.generateToken();
    userID = user._id;
    user.save();
  });

});

afterEach(() => {
  Order.remove({});
  return User.remove({});
});


describe('GET /orders', () => {

  it('should respond with a 200 for a request made with a valid id', () => {
    let url = `http://${service}/orders`;
    return request
      .get(url)
      .set('Authorization', 'Bearer ' + generatedToken)
      .then(res => {
        expect(res.status).toEqual(200);
      });
  });

  it('should respond with a 401 for a request with no token provided', () => {
    let url = `http://${service}/orders`;
    return request
    .get(url)
    .set('Authorization', 'Bearer ')
    .catch(res => {
      expect(res.status).toEqual(401);
    });
  });

  it('should respond with a 404 for a valid request with an id not found', () => {
    let url = `http://${service}/orders/5a03e40f5ccd2e77f46c5fc0`;
    return request
      .get(url)
      .set('Authorization', 'Bearer ' + generatedToken)
      .catch(res => {
        expect(res.status).toEqual(404);
      });

  });
});

describe('POST /orders', () => {
  it('should respond with a 200 for a post request with a valid body', () => {
    let url = `http://${service}/orders`;
    return request
    .post(url)
    .set('Authorization', 'Bearer ' + generatedToken)
    .send({item: 'hat', orderedDate: Date.now, user: userID})
    .then(res => {
      expect(res.status).toEqual(200);
    });
  });

  it('should respond with a 401 for a request with no token provided', () => {
    let url = `http://${service}/orders`;
    return request
    .post(url)
    .set('Authorization', 'Bearer ')
    .send({item: 'hat', orderedDate: Date.now, user: userID})
    .catch(res => {
      expect(res.status).toEqual(401);
    });
  });

  it('should respond with a 400 for a request with no body provided or invalid body', () => {
    let url = `http://${service}/orders`;

    return request
    .post(url)
    .set('Authorization', 'Bearer ' + generatedToken)
    .send({a:'b'})
    .catch(res => {
      expect(res.status).toEqual(400);
    });
  });
});

describe('PUT /orders/:id', () => {
  it('should respond with a 200 for a put request with a valid body', () => {

    let postUrl = `http://${service}/orders`;
    return request
    .post(postUrl)
    .set('Authorization', 'Bearer ' + generatedToken)
    .send({item: 'socks', orderedDate: Date.now, user: userID})
    .then(res => {
      //console.log(`res.id: `, res);
      let orderID = res.body._id;
      let url = `http://${service}/orders/${orderID}`;
      return request
      .put(url)
      .set('Authorization', 'Bearer ' + generatedToken)
      .send({item: 'shoes', orderedDate: Date.now, user: userID})
      .then(res => {
        expect(res.status).toEqual(200);
      });
    });
  });

  it('should respond with a 401 for a request with no token provided', () => {
    let postUrl = `http://${service}/orders`;
    return request
    .post(postUrl)
    .set('Authorization', 'Bearer ' + generatedToken)
    .send({item: 'socks', orderedDate: Date.now, user: userID})
    .then(res => {
      //console.log(`res.id: `, res);
      let orderID = res.body._id;
      let url = `http://${service}/orders/${orderID}`;
      return request
      .put(url)
      .set('Authorization', 'Bearer ')
      .send({item: 'hat', orderedDate: Date.now, user: userID})
      .catch(res => {
        expect(res.status).toEqual(401);
      });
    });
  });


  it('should respond with a 400 for a request with an invalid body', () => {
    let postUrl = `http://${service}/orders`;
    return request
    .post(postUrl)
    .set('Authorization', 'Bearer ' + generatedToken)
    .send({item: 'socks', orderedDate: Date.now, user: userID})
    .then(res => {
      let orderID = res.body._id;
      let url = `http://${service}/orders/${orderID}`;
      return request
      .put(url)
      .set('Authorization', 'Bearer ' + generatedToken)
      .send({a:'b'})
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
  });

  it('should respond with a 404 for a put request with an id not found', () => {
    let url = `http://${service}/orders/5a0817a67d2ff1768b2b115b`;
    return request
    .put(url)
    .set('Authorization', 'Bearer ' + generatedToken)
    .send({item: 'pens', orderedDate: Date.now, user: userID})
    .catch(res => {
      expect(res.status).toEqual(404);
    });

  });
});
