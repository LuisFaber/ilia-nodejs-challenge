import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

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

  @ApiPropertyOptional({ example: "john@example.com" })
  @IsOptional()
  @IsEmail({}, { message: "email must be a valid email" })
  email?: string;

  @ApiPropertyOptional({ example: "newsecret123", minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: "password must be at least 6 characters" })
  password?: string;

  @ApiPropertyOptional({ example: "en", enum: ["en", "pt", "es"] })
  @IsOptional()
  @IsString()
  @IsIn(["en", "pt", "es"], { message: "language must be en, pt or es" })
  language?: "en" | "pt" | "es";
}

