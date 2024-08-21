import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async deleteManyByAnswerId(answerId: string) {
    const items = this.items.filter(
      item => item.answerId.toString() !== answerId
    );

    this.items = items;
  }

  async findManyByAnswerId(answerId: string) {
    const items = this.items.filter(
      item => item.answerId.toString() === answerId
    );

    return items;
  }
}
