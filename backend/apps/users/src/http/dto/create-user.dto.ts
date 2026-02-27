import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty({ message: "first_name is required" })
  first_name: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty({ message: "last_name is required" })
  last_name: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail({}, { message: "email must be a valid email" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "secret123", minLength: 6 })
  @IsString()
  @MinLength(6, { message: "password must be at least 6 characters" })
  password: string;
}

