import { Injectable } from "@nestjs/common";
import type { IUserRepository } from "../../domain/repositories";
import { User } from "../../domain/entities";
import { PrismaService } from "./prisma.service";
import { toDomain, toPersistence } from "./mappers/user.mapper";

@Injectable()
export class UserRepositoryMySQL implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = toPersistence(user);
    const row = await this.prisma.user.create({ data });
    return toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    if (!row) return null;
    return toDomain(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    if (!row) return null;
    return toDomain(row);
  }

  async update(user: User): Promise<void> {
    const data = toPersistence(user);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        updatedAt: data.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}

