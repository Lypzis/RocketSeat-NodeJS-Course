import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
