import { PrismaClient } from "@prisma/client";
import { Amount } from "../../../domain/value-objects/amount";
import { TransactionType } from "../../../domain/value-objects/transaction-type";
import { Transaction } from "../../../domain/entities/transaction";

type PrismaTransactionRow = Awaited<
  ReturnType<PrismaClient["transaction"]["findMany"]>
>[number];

export function toDomain(row: PrismaTransactionRow): Transaction {
  const amount = Amount.create(row.amount);
  const type = TransactionType.create(row.type);
  const createdAt = new Date(row.createdAt);

  const description = row.description ?? undefined;
  if (type.isCredit()) {
    return Transaction.createCredit(row.id, row.userId, amount, description, createdAt);
  }
  return Transaction.createDebit(row.id, row.userId, amount, description, createdAt, row.amount);
}

export function toPersistence(transaction: Transaction): {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: Date;
} {
  return {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount.value,
    type: transaction.type.value,
    description: transaction.description ?? null,
    createdAt: transaction.createdAt,
  };
}
