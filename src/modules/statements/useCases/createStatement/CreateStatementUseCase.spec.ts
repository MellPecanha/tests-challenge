import {InMemoryUsersRepository} from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import {InMemoryStatementsRepository} from '../../repositories/in-memory/InMemoryStatementsRepository';
import {CreateStatementUseCase} from './CreateStatementUseCase';
import {OperationType} from "../../entities/Statement";
import {CreateStatementError} from './CreateStatementError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('create statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to create a deposit statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test name',
      email: 'test@example.com',
      password: 'test password',
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'test',
      type: OperationType.DEPOSIT,
      amount: 100,
    });

    expect(statement).toHaveProperty('id');
  });

  it('should be able to create a withdraw statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test name',
      email: 'test@example.com',
      password: 'test password',
    })

    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'test',
      type: OperationType.DEPOSIT,
      amount: 200,
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'test',
      type: OperationType.WITHDRAW,
      amount: 100,
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a statement with insufficient funds', async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'test name',
        email: 'test@example.com',
        password: 'test password',
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        description: 'test',
        type: OperationType.WITHDRAW,
        amount: 120,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })

  it('should not be able to create a statement with a non-existent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'no user id',
        description: 'test',
        type: OperationType.DEPOSIT,
        amount: 200,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })
});
