import { Inject, Injectable } from "@nestjs/common";
import type { ITransactionRepository } from "@domain/ports";
import type { Transaction } from "@domain/entities/transaction";
import { TRANSACTION_REPOSITORY } from "@domain/ports";

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async run(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }
}
