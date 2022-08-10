import {InMemoryUsersRepository} from '../../repositories/in-memory/InMemoryUsersRepository';
import {ShowUserProfileError} from './ShowUserProfileError'
import {ShowUserProfileUseCase} from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show user profile authenticated', async () => {
    const userCreated = await inMemoryUsersRepository.create({
      name: 'test2',
      email: 'email@test.com',
      password: 'password',
    });

    const user = await inMemoryUsersRepository.findByEmail(userCreated.email);

    let userId = user?.id;

    if (!userId) {
      userId = 'id not valid'
    }

    const showUser = await showUserProfileUseCase.execute(userId);

    expect(showUser).toHaveProperty('id');
    expect(showUser.email).toEqual(userCreated.email);
  });

  it('should not be able to show a non-existent user', async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute(`id isn't valid`)
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
