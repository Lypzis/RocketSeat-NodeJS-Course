import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms';
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeFetchNearbyGymUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
}
