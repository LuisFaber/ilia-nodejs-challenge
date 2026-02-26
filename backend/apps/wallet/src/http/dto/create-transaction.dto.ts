import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsPositive } from "class-validator";

export class CreateTransactionDto {
  @ApiProperty({ example: 100, description: "Amount (integer, positive)" })
  @IsInt()
  @IsPositive({ message: "amount must be greater than 0" })
  amount!: number;

  @ApiProperty({ example: "credit", enum: ["credit", "debit"] })
  @IsIn(["credit", "debit"], {
    message: "type must be one of: credit, debit",
  })
  type!: "credit" | "debit";
}
