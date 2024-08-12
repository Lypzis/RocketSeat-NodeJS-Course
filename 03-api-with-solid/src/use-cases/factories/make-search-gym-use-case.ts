import { SearchGymsUseCase } from '../search-gyms';
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const useCase = new SearchGymsUseCase(gymsRepository);

  return useCase;
}
