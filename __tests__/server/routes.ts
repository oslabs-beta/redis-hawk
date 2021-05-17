const request = require('supertest');

const SERVER_URL = 'http://localhost:3000'

describe('Route Integration Tests', () => {

  let app, redisMonitors;
  beforeAll(async () => {
    app = await require('../../server/server');
    redisMonitors = require('../../server/redis-monitors/redis-monitors');
  });

  afterAll(async () => {
    await app.close();
    redisMonitors.forEach((monitor) => {
      monitor.redisClient.quit();
    });
  });

  describe('/api/connections', () => {

    describe("GET '/'", () => {

      let response;
      beforeAll(async () => {
        response = await request(app)
          .get(SERVER_URL);
      })

      it('should return a 200 status code', () => {
        response.expect(200);
      });
    });
  });
});