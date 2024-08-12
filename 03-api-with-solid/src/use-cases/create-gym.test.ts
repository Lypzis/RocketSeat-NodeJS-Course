import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/In-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

// Unit testing
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -25.433682,
      longitude: -49.2589333,
    });

    // if user was created, expect it to have an id
    expect(gym.id).toEqual(expect.any(String));
  });
});
