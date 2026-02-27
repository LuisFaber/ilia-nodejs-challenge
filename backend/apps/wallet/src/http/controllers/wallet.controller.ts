import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.usecase";
import { GetBalanceUseCase } from "../../application/use-cases/get-balance.usecase";
import { ListTransactionsUseCase } from "../../application/use-cases/list-transactions.usecase";
import type { Transaction } from "../../domain/entities/transaction";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import {
  BalanceResponseDto,
  TransactionResponseDto,
} from "../dto/wallet-response.dto";
import { UserId } from "../decorators/user-id.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

function toTransactionResponse(t: Transaction) {
  return {
    id: t.id,
    userId: t.userId,
    amount: t.amount.value,
    type: t.type.value.toLowerCase(),
    createdAt: t.createdAt.toISOString(),
  };
}

@ApiTags("wallet")
@Controller("wallet")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase
  ) {}

  @Post("transactions")
  @ApiOperation({ summary: "Create a transaction (credit or debit)" })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 200, description: "Transaction created", type: TransactionResponseDto })
  @ApiResponse({ status: 400, description: "Invalid body (amount or type)" })
  @ApiResponse({ status: 401, description: "Access token is missing or invalid" })
  async createTransaction(
    @UserId() userId: string,
    @Body() dto: CreateTransactionDto
  ) {
    const transaction = await this.createTransactionUseCase.run({
      userId,
      amount: dto.amount,
      type: dto.type,
    });
    return toTransactionResponse(transaction);
  }

  @Get("balance")
  @ApiOperation({ summary: "Get current balance" })
  @ApiResponse({ status: 200, description: "Current balance", type: BalanceResponseDto })
  @ApiResponse({ status: 401, description: "Access token is missing or invalid" })
  async getBalance(@UserId() userId: string) {
    const amount = await this.getBalanceUseCase.run(userId);
    return { amount };
  }

  @Get("transactions")
  @ApiOperation({ summary: "List user transactions" })
  @ApiResponse({
    status: 200,
    description: "List of transactions",
    type: [TransactionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Access token is missing or invalid" })
  async listTransactions(@UserId() userId: string) {
    const transactions = await this.listTransactionsUseCase.run(userId);
    return transactions.map(toTransactionResponse);
  }
}
