import {InMemoryUsersRepository} from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import {OperationType} from '../../entities/Statement';
import {InMemoryStatementsRepository} from '../../repositories/in-memory/InMemoryStatementsRepository';
import {GetStatementOperationError} from './GetStatementOperationError';
import {GetStatementOperationUseCase} from './GetStatementOperationUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('get statement operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should be able to get statement operation', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test name',
      email: 'test email',
      password: 'test password',
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: 'deposit statement test',
      type: OperationType.DEPOSIT,
      amount: 120,
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(operation).toEqual(statement);
  });
  it('should not be able to get statement operation with non-existent statement', async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'test name',
        email: 'test email',
        password: 'test password',
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'no statement id',
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it('should not be able to get statement operation with non-existent user', async () => {
    expect(async () => {
      const statement = await inMemoryStatementsRepository.create({
        user_id: 'no user id',
        description: 'deposit statement test',
        type: OperationType.DEPOSIT,
        amount: 120,
      });

      await getStatementOperationUseCase.execute({
        user_id: 'no user id',
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
})
