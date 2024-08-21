import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];
  private MAX_ANSWERS_PER_PAGE = 20;

  constructor(
    private answerAttachmentRepository: AnswerAttachmentsRepository
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string) {
    const item = this.items.find(item => item.id.toString() === id);

    if (!item) return null;

    return item;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const items = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice(
        (page - 1) * this.MAX_ANSWERS_PER_PAGE,
        page * this.MAX_ANSWERS_PER_PAGE
      );

    return items;
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex(item => item.id === answer.id);

    this.items[itemIndex] = answer;
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex(item => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
