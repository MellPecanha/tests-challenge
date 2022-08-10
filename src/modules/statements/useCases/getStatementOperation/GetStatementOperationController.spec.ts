import {app} from '../../../../app';
import request from 'supertest';
import createConnection from '../../../../database'
import {Connection} from "typeorm"

let connection: Connection;

describe('get statement operation controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get statement operation', async () => {
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

    const deposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 120,
        description: 'deposit',
      })
      .set({
        authorization: `Bearer ${session.body.token}`
      });

    const result = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        authorization: `Bearer ${session.body.token}`
      });

    expect(result.status).toEqual(200);
    expect(result.body.user_id).toEqual(session.body.user.id);
    expect(result.body.statement_id).toEqual(deposit.body.statement_id);
  });
});
