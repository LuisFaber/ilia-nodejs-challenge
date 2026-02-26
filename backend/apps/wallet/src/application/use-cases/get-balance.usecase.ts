import { Inject, Injectable } from "@nestjs/common";
import type { ITransactionRepository } from "@domain/ports";
import { TRANSACTION_REPOSITORY } from "@domain/ports";

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async run(userId: string): Promise<number> {
    return this.transactionRepository.getBalance(userId);
  }
}
