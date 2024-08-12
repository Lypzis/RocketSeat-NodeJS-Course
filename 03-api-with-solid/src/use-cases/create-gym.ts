import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseRequest {
  title: string;
  description?: string | null;
  phone?: string | null;
  latitude: number;
  longitude: number;
}

interface GymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<GymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
