import {app} from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database'
import {Connection} from "typeorm"

let connection: Connection;

describe('create user controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a user', async () => {
    const createUser = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'name test',
        email: 'test@email.com',
        password: '1234'
      });

    expect(createUser.status).toEqual(201);
  });
});
