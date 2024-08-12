import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';

import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/In-memory-gyms-repository';

let gymRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

// Unit testing
describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -25.433682,
      longitude: -49.2589333,
    });

    await gymRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -25.433682,
      longitude: -49.2589333,
    });

    const { gyms } = await sut.execute({ query: 'JavaScript', page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    await Promise.all(
      new Array(22).fill(null).map(async (_, index) =>
        gymRepository.create({
          title: `JavaScript Gym ${index + 1}`,
          description: null,
          phone: null,
          latitude: -25.433682,
          longitude: -49.2589333,
        })
      )
    );

    const { gyms } = await sut.execute({ query: 'JavaScript', page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);
  });
});
