import {app} from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database'
import {Connection} from "typeorm"

let connection: Connection;

describe('show user profile controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show user profile', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'name test',
        email: 'test@email.com',
        password: '1234'
      });

    const session = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'test@email.com',
        password: '1234'
      });

    const profile = await request(app)
      .get(`/api/v1/profile`)
      .set({
        authorization: `Bearer ${session.body.token}`
      });

    expect(profile.body.name).toEqual('name test');
  });
});
