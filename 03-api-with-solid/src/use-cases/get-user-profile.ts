import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { ResourceDoesNotExistsError } from './errors/resource-does-not-exists';

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceDoesNotExistsError();

    return { user };
  }
}
