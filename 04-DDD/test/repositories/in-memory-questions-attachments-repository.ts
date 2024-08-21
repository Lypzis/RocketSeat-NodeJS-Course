import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async deleteManyByQuestionId(questionId: string) {
    const items = this.items.filter(
      item => item.questionId.toString() !== questionId
    );

    this.items = items;
  }

  async findManyByQuestionId(questionId: string) {
    const items = this.items.filter(
      item => item.questionId.toString() === questionId
    );

    return items;
  }
}
