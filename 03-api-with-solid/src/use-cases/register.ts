import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';
import bcrypt from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists';
import { User } from '@prisma/client';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserCaseResponse {
  user: User;
}

// SOLID
// D - Dependency Inversion Principle
export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUserCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(password, 6); // 6 is ok for user creation

    // no direct connection with prisma anymore,
    // so in case of change, it won't be necessary to update every where
    const user = await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return { user };
  }
}
