import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceDoesNotExistsError } from './errors/resource-does-not-exists';
import { LateCheckInValidationError } from './errors/late-check-in-validation';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

// Unit testing
describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(async () =>
      sut.execute({
        checkInId: 'a-non-existent-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceDoesNotExistsError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21; // 21 minutes

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(async () =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
