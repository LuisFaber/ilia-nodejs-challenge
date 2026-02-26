import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { ITransactionContext, ITransactionRepository } from "@domain/ports";
import { Transaction } from "@domain/entities/transaction";
import { Amount } from "@domain/value-objects/amount";
import { TransactionType } from "@domain/value-objects/transaction-type";
import { TRANSACTION_REPOSITORY } from "@domain/ports";

export interface CreateTransactionInput {
  userId: string;
  amount: number;
  type: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async run(input: CreateTransactionInput): Promise<Transaction> {
    const { userId, amount, type } = input;
    const amountVO = Amount.create(amount);
    const typeVO = TransactionType.create(type);

    return this.transactionRepository.runInTransaction(async (ctx: ITransactionContext) => {
      const currentBalance = await ctx.getBalanceLocked(userId);
      const id = randomUUID();
      const createdAt = new Date();

      const transaction =
        typeVO.isCredit()
          ? Transaction.createCredit(id, userId, amountVO, createdAt)
          : Transaction.createDebit(id, userId, amountVO, createdAt, currentBalance);

      await ctx.save(transaction);
      return transaction;
    });
  }
}
