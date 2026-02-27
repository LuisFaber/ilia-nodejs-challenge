import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import type { ITransactionContext, ITransactionRepository } from "../../../domain/ports";
import { Transaction } from "../../../domain/entities/transaction";
import { toDomain, toPersistence } from "../mappers/transaction.mapper";

type PrismaTx = Prisma.TransactionClient;

type BalanceRow = [{ balance: number }];

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<void> {
    const data = toPersistence(transaction);
    await this.prisma.transaction.create({ data });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(toDomain);
  }

  async getBalance(userId: string): Promise<number> {
    const rows = await this.prisma.$queryRaw<BalanceRow>`
      SELECT COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END), 0) as balance
      FROM transactions
      WHERE user_id = ${userId}
    `;
    return Number(rows[0]?.balance ?? 0);
  }

  async runInTransaction<T>(fn: (ctx: ITransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: PrismaTx) => {
      const ctx: ITransactionContext = {
        getBalanceLocked: (userId: string) => this.getBalanceLocked(tx, userId),
        save: (transaction: Transaction) => this.saveWithTx(tx, transaction),
      };
      return fn(ctx);
    });
  }

  private async getBalanceLocked(tx: PrismaTx, userId: string): Promise<number> {
    const rows = await tx.$queryRaw<BalanceRow>`
      SELECT COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END), 0) as balance
      FROM transactions
      WHERE user_id = ${userId}
      FOR UPDATE
    `;
    return Number(rows[0]?.balance ?? 0);
  }

  private async saveWithTx(tx: PrismaTx, transaction: Transaction): Promise<void> {
    const data = toPersistence(transaction);
    await tx.transaction.create({ data });
  }
}
