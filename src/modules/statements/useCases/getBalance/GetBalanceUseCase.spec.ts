import {InMemoryUsersRepository} from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import {OperationType} from '../../entities/Statement';
import {InMemoryStatementsRepository} from '../../repositories/in-memory/InMemoryStatementsRepository'
import {GetBalanceError} from './GetBalanceError';
import {GetBalanceUseCase} from './GetBalanceUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('get balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it('should be able to get a balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'test name',
      email: 'test email',
      password: 'test password',
    });

    const deposit = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: 'deposit statement test',
      type: OperationType.DEPOSIT,
      amount: 120,
    });

    const withdraw = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: 'withdraw statement test',
      type: OperationType.WITHDRAW,
      amount: 90.
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toStrictEqual({
      statement: [deposit, withdraw],
      balance: 30,
    });
  });

  it('should not be able to create a balance with a non-existent user', async () => {
    expect(async () => {
      await inMemoryStatementsRepository.create({
        user_id: 'no user id',
        description: 'withdraw statement test',
        type: OperationType.DEPOSIT,
        amount: 90.
      });

      await getBalanceUseCase.execute({
        user_id: 'no user id',
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
