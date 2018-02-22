'use strict';

const server = require('../lib/server');
const User = require('../models/user');
const superagent = require('superagent');
const faker = require('faker');

require('jest');

describe('Testing basic auth routes', function() {

  beforeAll(server.start);
  afterAll(server.stop);


  describe('POST to /api/signup', () => {

    describe('Valid requests', () => {
      this.mockUserData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      test('should POST a new user to the db, and return user data', () => {
        return superagent.post(':4000/api/signup')
          .send(this.mockUserData)
          .then(res => {
            this.res = res;
            expect(this.res.status).toBe(200);
          });
      });
    });

    describe('Invalid requests', () => {

      test('Should throw 400 error with bad signUp information', () => {
        return superagent.post(':4000/api/signup')
          .send({})
          .then(res => {
            this.res = res;
            expect(this.res.status).toBe(400);
          });
      });

      test('Should throw 404 error on bad endpoint', () => {
        return superagent.post(':4000/api/signup')
          .send({})
          .then(res => {
            this.res = res;
            expect(this.res.status).toBe(400);
          });
      });
    });
  });

  describe('GET to /api/signin', () => {

    describe('Valid requests', () => {

      test('should GET a user token by sending username and password', () => {
        return superagent.get(':4000/api/signin')
          .auth(this.mockUserData.username, this.mockUserData.password)
          .then(res => {
            expect(res.status).toBe(200);
          });
      });
    });

    describe('Invalid requests', () => {
      test('should throw 400 with bad signIn credentials', () => {
        return superagent.get(':4000/api/signin')
          .auth(this.mockUserData.password)
          .then(res => {
            expect(res.status).toBe(401);
          });
      });
      test('should throw 404 for bad endpoint', () => {
        return superagent.get(':4000/api/sigin')
          .auth(this.mockUserData.password)
          .then(res => {
            expect(res.status).toBe(401);
          });
      });
    });
  });
});
