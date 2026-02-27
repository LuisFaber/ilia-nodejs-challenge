import { PrismaClient } from "@prisma/client";
import { User } from "../../../domain/entities";
import { Email } from "../../../domain/value-objects";

type PrismaUserRow = Awaited<
  ReturnType<PrismaClient["user"]["findMany"]>
>[number];

export function toDomain(row: PrismaUserRow): User {
  const email = Email.create(row.email);
  return User.create({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email,
    passwordHash: row.password,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export function toPersistence(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email.value,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

