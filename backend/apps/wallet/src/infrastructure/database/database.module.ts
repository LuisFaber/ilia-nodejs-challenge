import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaTransactionRepository } from "./repositories/prisma-transaction.repository";

@Global()
@Module({
  providers: [PrismaService, PrismaTransactionRepository],
  exports: [PrismaService, PrismaTransactionRepository],
})
export class DatabaseModule {}
