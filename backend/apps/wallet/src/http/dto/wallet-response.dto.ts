import { ApiProperty } from "@nestjs/swagger";

export class TransactionResponseDto {
  @ApiProperty({ example: "uuid" })
  id!: string;

  @ApiProperty({ example: "user-1" })
  userId!: string;

  @ApiProperty({ example: 100 })
  amount!: number;

  @ApiProperty({ example: "credit", enum: ["credit", "debit"] })
  type!: string;

  @ApiProperty({ example: "2025-01-15T10:00:00.000Z" })
  createdAt!: string;
}

export class BalanceResponseDto {
  @ApiProperty({ example: 150, description: "Current balance (credits - debits)" })
  amount!: number;
}
