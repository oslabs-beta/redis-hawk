const request = require('supertest');
const SERVER_URL = 'http://localhost:3000'
let expressApp = require('../../server/server');

describe('Route Integration Tests', () => {

  let redisMonitors;
  beforeAll(async () => {
    redisMonitors = require('../../server/redis-monitors/redis-monitors');
  });

  afterAll(async () => {
    await expressApp.close();
    redisMonitors.forEach((monitor) => {
      monitor.redisClient.quit();
    });
  });

  describe('/api/connections', () => {

    describe("GET '/'", () => {

      let response;
      beforeAll(async () => {
        response = await request(expressApp)
          .get(SERVER_URL);
      })

      it('should return a 200 status code', () => {
        response.expect(200);
      });
    });
  });
});