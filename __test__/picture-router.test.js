'use strict';

// requires setup
require('./lib/setup.js');
require('./lib/setup.mock.aws.js');

// requre npm
const superagent = require('superagent');
const expect = require('expect');
// app modules
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const pictureMock = require('./lib/picture-mock.js');
// test globals
const apiURL = `http://localhost:${process.env.PORT}`;
// tests

describe('/pictures', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(pictureMock.remove);
  afterEach(accountMock.remove);

  test('POST /pictures  200', () => {
    let tempAccountMock;
    return accountMock.create()
      .then(accountMock => {
        tempAccountMock = accountMock;
        return superagent.post(`${apiURL}/pictures`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .field('title', 'picture of water')
          .attach('picture', `${__dirname}/asset/pic.jpg`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.title).toEqual('picture of water');
            expect(res.body._id).toBeTruthy();
            expect(res.body.url).toBeTruthy();
            expect(res.body.account).toEqual(tempAccountMock.account._id.toString());
          });

      });
  });
});
