import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/In-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins';
import { MaxDistanceError } from './errors/max-distance';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

// Unit testing
describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -25.433682,
      longitude: -49.2589333,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.433682,
      userLongitude: -49.2589333,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  // TDD - Test Driven Development
  // Stages: red(errors), green(make the code work), refactor(improve code)

  it('should not be able to check in twice the same day', async () => {
    // this garantees that the checkins are being created at the same time
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.433682,
      userLongitude: -49.2589333,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -25.433682,
        userLongitude: -49.2589333,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should  be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.433682,
      userLongitude: -49.2589333,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.433682,
      userLongitude: -49.2589333,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on a distant gym', async () => {
    gymsRepository.items[0] = {
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-20.423351),
      longitude: new Decimal(-49.297758),
    };

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -25.433682,
        userLongitude: -49.2589333,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
