/*
Provides functionality for generating mock keys and mock values for in-scope Redis data types

Used by /utils/mock-commands.js
*/

const faker = require("faker");

const mockData = {};

/* <<<<< Strings >>>>> */
mockData.strings = {
  //Generates keys with corresponding string values. Uses "messages" as a mocked use-case for strings.

  createKey() {
    return `message:${Math.floor(Math.random() * 100000)}`;
  },

  createValue() {
    return faker.lorem.sentence();
  },
};

/* <<<<< Lists >>>>> */
mockData.lists = {
  createKey() {
    return `names:${Math.floor(Math.random() * 10000)}`;
  },

  createValue() {

    let list = [];
    for (let i = 0; i < 5; i++) {
      list.push(faker.name.firstName());
    }
    return list;
  },
};

/* <<<<< Sets >>>>> */
mockData.sets = {
  createKey() {
    return `tech:${Math.floor(Math.random() * 10000)}`;
  },

  createValue() {

    const set = new Set();
    for (let i = 0; i < 5; i++) {
      set.add(faker.company.bs());
    }
    return Array.from(set);
  }
};

/* <<<<< Sorted Sets >>>>> */
mockData.sortedSets = {
  createKey() {
    return `leaders:${Math.floor(Math.random() * 10000)}`;
  },

  createValue() {

    const zset = [];

    for (let i = 0; i < 5; i++) {
      zset.push(Math.floor(Math.random()) * 1000);
      zset.push(faker.internet.userName());
    }

    return zset;
  }
};

/* <<<<< Hashes >>>>> */
mockData.hashes = {
  createKey() {
    return `user:${Math.floor(Math.random() * 100000)}`;
  },

  createValue() {

    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      country: faker.address.country()
    }
    
    return user
  },
};

module.exports = mockData;
