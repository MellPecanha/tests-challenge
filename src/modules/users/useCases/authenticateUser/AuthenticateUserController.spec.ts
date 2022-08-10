import {app} from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database'
import {Connection} from "typeorm"

let connection: Connection;

describe('authenticate user controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate a user', async () => {
    const user = await request(app)
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

    expect(session.body).toHaveProperty('token');
    expect(session.body.user.name).toEqual('name test');
  });
});
