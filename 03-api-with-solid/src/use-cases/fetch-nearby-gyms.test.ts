import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/In-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

// Unit testing
describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymRepository);
  });

  it('should be able to fetch nearby  gyms', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -25.433682,
      longitude: -49.2589333,
    });

    await gymRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -20.423351,
      longitude: -49.297758,
    });

    const { gyms } = await sut.execute({
      userLatitude: -25.433682,
      userLongitude: -49.2589333,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
