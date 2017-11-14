'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Picture = require('../../model/picture.js');

// resolves a {tempAccount, picture}
const create = () => {
  let result = {};
  return accountMock.create()
    .then( account => {
      result.tempAccount = account;
      return new Picture({
        account: account._id,
        title: faker.lorem.words(10),
        url: faker.image.image(),
      }).save();
    })
    .then(picture => {
      result.picture = picture;
      return result;
    });
};

const remove = () => {
  return Promise.all([
    accountMock.remove,
    Picture.remove({}),
  ]);
};

module.exports = { create, remove };
