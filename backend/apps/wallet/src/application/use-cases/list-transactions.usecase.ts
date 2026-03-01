import { Inject, Injectable } from "@nestjs/common";
import type { ITransactionRepository } from "@domain/ports";
import type { Transaction } from "@domain/entities/transaction";
import { TRANSACTION_REPOSITORY } from "@domain/ports";

export interface ListTransactionsInput {
  userId: string;
  page?: number;
  limit?: number;
}

export interface ListTransactionsOutput {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async run(input: ListTransactionsInput): Promise<ListTransactionsOutput> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 8));
    const { items, total } = await this.transactionRepository.findByUserId(
      input.userId,
      { page, limit }
    );
    return { items, total, page, limit };
  }
}
