import { FetchUserCheckInsHistorysUseCase } from '../fetch-user-checkins-history';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeFetchUserCheckInHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistorysUseCase(checkInsRepository);

  return useCase;
}
