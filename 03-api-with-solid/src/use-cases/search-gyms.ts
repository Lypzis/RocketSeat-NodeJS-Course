import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface GymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<GymUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany(query, page);

    return { gyms };
  }
}
