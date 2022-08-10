import {InMemoryUsersRepository} from '../../repositories/in-memory/InMemoryUsersRepository';
import {CreateUserError} from './CreateUserError';
import {CreateUserUseCase} from './CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('create user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create a user', async () => {
    const user = await createUserUseCase.execute({
      name: 'test name',
      email: 'test@example.com',
      password: 'test password',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user if e-mail already exists', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'test1',
        email: 'email@test.com',
        password: 'password',
      });

      await createUserUseCase.execute({
        name: 'test2',
        email: 'email@test.com',
        password: 'password',
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
