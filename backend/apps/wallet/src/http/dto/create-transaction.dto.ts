import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

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

  @ApiPropertyOptional({
    example: "Initial deposit",
    description: "Optional transaction description (max 120 characters)",
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120, { message: "description cannot exceed 120 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  description?: string;
}
