import {app} from '../../../../app';
import request from 'supertest';
import {Connection, createConnection} from "typeorm"

let connection: Connection;

describe('create statement controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a deposit statement', async () => {
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

    const result = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 110,
        description: 'deposit test'
      })
      .set({authorization: `Bearer ${session.body.token}`, });


    expect(result.status).toEqual(201);
    expect(result.body.type).toEqual('deposit');
  });

  it('should be able to create a withdraw statement', async () => {
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

    const result = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 100,
        description: 'withdraw test'
      })
      .set({authorization: `Bearer ${session.body.token}`, });


    expect(result.status).toEqual(201);
    expect(result.body.type).toEqual('withdraw');
  });
});
