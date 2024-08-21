import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];
  private MAX_ANSWERS_PER_PAGE = 20;

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
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

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      item => item.id === questionComment.id
    );

    this.items.splice(itemIndex, 1);
  }
}
