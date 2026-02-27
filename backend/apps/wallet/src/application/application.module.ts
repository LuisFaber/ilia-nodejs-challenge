import { Module } from "@nestjs/common";
import { CreateTransactionUseCase } from "./use-cases/create-transaction.usecase";
import { GetBalanceUseCase } from "./use-cases/get-balance.usecase";
import { ListTransactionsUseCase } from "./use-cases/list-transactions.usecase";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [CreateTransactionUseCase, GetBalanceUseCase, ListTransactionsUseCase],
  exports: [CreateTransactionUseCase, GetBalanceUseCase, ListTransactionsUseCase],
})
export class ApplicationModule {}
