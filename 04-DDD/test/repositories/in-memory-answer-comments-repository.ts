import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];
  private MAX_ANSWERS_PER_PAGE = 20;

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async findById(id: string) {
    const item = this.items.find(item => item.id.toString() === id);

    if (!item) return null;

    return item;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const items = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice(
        (page - 1) * this.MAX_ANSWERS_PER_PAGE,
        page * this.MAX_ANSWERS_PER_PAGE
      );

    return items;
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      item => item.id === answerComment.id
    );

    this.items.splice(itemIndex, 1);
  }
}
