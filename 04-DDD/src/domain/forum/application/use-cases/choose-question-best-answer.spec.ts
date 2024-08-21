import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answers-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryAttachmentAnswersRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAttachmentQuestionsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAttachmentAnswersRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAttachmentQuestionsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentQuestionsRepository,
    )
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAttachmentAnswersRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it("should be able to choose a question's best answer", async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await inMemoryQuestionRepository.create(newQuestion)
    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(
      newAnswer.id,
    )
  })

  it("should not be able to choose another user question's best answer", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    })
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await inMemoryQuestionRepository.create(newQuestion)
    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-id-different',
      answerId: newAnswer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
