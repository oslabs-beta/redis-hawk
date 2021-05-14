/*
Provides functionality for generating mock keys and mock values for in-scope Redis data types

Used by /utils/mock-commands.js
*/

const mockData = {};

mockData.strings = {
//Generates keys with corresponding string values. Uses "messages" as a mocked use-case for strings.

  createKey() {
    return `message:${Math.floor(Math.random() * 100000)}`;
  },

  createValue() {
    return 'test-message';
  }
}

mockData.lists = {
  createKey() {

  },

  createValue() {

  }
}

mockData.hashes = {
  createKey() {

  },

  createValue() {

  }

}

mockData.sets = {
  createKey() {

  },

  createValue() {

  }
}
module.exports = mockData;