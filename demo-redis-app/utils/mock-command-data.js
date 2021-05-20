/*
Provides functionality for generating mock keys and mock values for in-scope Redis data types

Used by /utils/mock-commands.js
*/

const faker = require('faker');

const mockData = {};

mockData.strings = {
  //Generates keys with corresponding string values. Uses "messages" as a mocked use-case for strings.

  createKey() {
    return `message:${Math.floor(Math.random() * 100000)}`;
  },

  createValue() {
    const names = ['Abigail', 'Arthur', 'James', 'Wesley'];
    const name = names[Math.floor(Math.random() * 4)]
    const message = `${name} is a ${faker.hacker.adjective()} ${faker.hacker.noun()} working on ${faker.company.catchPhrase()}! Wow!`
    return message;
  }
}

mockData.lists = {
  createKey() {
    return `list:${Math.floor(Math.random() * 10000)}`;
  },

  createValue() {
    return ['testmsg1', 'testmsg2', 'testmsg3', 'testmsg4']
  }
}

mockData.hashes = {
  createKey() {
    return `hash:${Math.floor(Math.random() * 100000)}`;
  },

  createValue() {
    return {
      user: 'tester',
      pass: 'pass1234',
      age: 27,
      occupation: "gokart mechanic"
    }
  }

}

mockData.sets = {
  createKey() {

  },

  createValue() {

  }
}
module.exports = mockData;