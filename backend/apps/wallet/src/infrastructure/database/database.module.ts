import { Global, Module } from "@nestjs/common";
import { TRANSACTION_REPOSITORY } from "../../domain/ports";
import { PrismaService } from "./prisma.service";
import { PrismaTransactionRepository } from "./repositories/prisma-transaction.repository";

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaTransactionRepository,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [PrismaService, TRANSACTION_REPOSITORY],
})
export class DatabaseModule {}
