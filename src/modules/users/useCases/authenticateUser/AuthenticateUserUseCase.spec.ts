
import {hash} from 'bcryptjs';
import {InMemoryUsersRepository} from '../../repositories/in-memory/InMemoryUsersRepository';
import {AuthenticateUserUseCase} from './AuthenticateUserUseCase';
import {IncorrectEmailOrPasswordError} from './IncorrectEmailOrPasswordError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to authenticate an user', async () => {
    inMemoryUsersRepository.create({
      name: 'test name',
      email: 'name@test.com',
      password: await hash('1234', 8),
    });

    const result = await authenticateUserUseCase.execute({
      email: 'name@test.com',
      password: '1234',
    });

    expect(result).toHaveProperty('token');
  });


  it('should not be able to authenticate a non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'name@test.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate with incorrect email', async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: 'test name',
        email: 'name@test.com',
        password: await hash('1234', 8),
      });

      await authenticateUserUseCase.execute({
        email: 'incorrect email',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: 'test name',
        email: 'name@test.com',
        password: await hash('1234', 8),
      });

      await authenticateUserUseCase.execute({
        email: 'name@test.com',
        password: '5678',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
