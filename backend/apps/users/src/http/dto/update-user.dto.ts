import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "John" })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "first_name cannot be empty" })
  first_name?: string;

  @ApiPropertyOptional({ example: "Doe" })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "last_name cannot be empty" })
  last_name?: string;
}

