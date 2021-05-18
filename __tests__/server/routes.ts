import * as request from 'supertest';
import app from '../../server/server';

describe('Something', () => {

  afterAll( async () => {
    await app.close();
  });

  it('hello', async () => {
    await request(app).get('/')
      .expect(200)
  })
})

