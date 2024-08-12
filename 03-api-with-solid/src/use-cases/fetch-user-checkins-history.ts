import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistorysUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistorysUseCase {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistorysUseCaseResponse> {
    let checkIns = await this.CheckInsRepository.findManyByUserId(userId, page);

    return { checkIns };
  }
}
