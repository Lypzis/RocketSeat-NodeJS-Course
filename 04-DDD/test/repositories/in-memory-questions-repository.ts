import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];
  public MAX_QUESTIONS_PER_PAGE = 20;

  constructor(
    private questionAttachmentRepository: QuestionAttachmentsRepository
  ) {}

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex(item => item.id === question.id);

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (page - 1) * this.MAX_QUESTIONS_PER_PAGE,
        page * this.MAX_QUESTIONS_PER_PAGE
      );

    return questions;
  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findById(id: string) {
    const item = this.items.find(item => item.id.toString() === id);

    if (!item) return null;

    return item;
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex(item => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
}
