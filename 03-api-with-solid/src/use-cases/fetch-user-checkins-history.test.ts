import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { FetchUserCheckInsHistorysUseCase } from './fetch-user-checkins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistorysUseCase;

// Unit testing
describe('Fetch Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistorysUseCase(checkInsRepository);
  });

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gymId: 'gym-02',
      user_id: 'user-01',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-01' }),
      expect.objectContaining({ gymId: 'gym-02' }),
    ]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    await Promise.all(
      new Array(22).fill(null).map(async (_, index) =>
        checkInsRepository.create({
          gymId: `gym-${index + 1}`,
          user_id: 'user-01',
        })
      )
    );

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ]);
  });
});
