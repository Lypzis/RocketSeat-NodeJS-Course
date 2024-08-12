import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

// Representation of db, but in-memory :D
export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];
  private MAX_GYM_DISTANCE = 10; // KM

  async findById(id: string) {
    const Gym = this.items.find(Gym => Gym.id === id);

    if (!Gym) return null;

    return Gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter(item => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        }
      );

      return distance < this.MAX_GYM_DISTANCE;
    });
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }
}
