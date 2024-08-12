import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckInUseCase } from '../checkin';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymRepository = new PrismaGymRepository();

  const useCase = new CheckInUseCase(checkInsRepository, gymRepository);

  return useCase;
}
