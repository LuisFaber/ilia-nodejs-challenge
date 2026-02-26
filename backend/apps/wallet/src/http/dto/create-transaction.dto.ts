import { IsIn, IsInt, IsPositive } from "class-validator";

export class CreateTransactionDto {
  @IsInt()
  @IsPositive({ message: "amount must be greater than 0" })
  amount!: number;

  @IsIn(["credit", "debit"], {
    message: "type must be one of: credit, debit",
  })
  type!: "credit" | "debit";
}
