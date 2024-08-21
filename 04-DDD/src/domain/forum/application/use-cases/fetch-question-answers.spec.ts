import { expect, describe, it, beforeEach } from 'vitest'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answers-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const question = makeQuestion()

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )

    await inMemoryAnswersRepository.create(makeAnswer())

    const result = await sut.execute({
      page: 1,
      questionId: question.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
    expect(result.value?.answers).toEqual([
      expect.objectContaining({ questionId: question.id }),
      expect.objectContaining({ questionId: question.id }),
    ])
  })

  it('should be able to fetch paginated question answers', async () => {
    const question = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: question.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
