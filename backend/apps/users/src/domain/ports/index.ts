import type { IUserRepository } from "../repositories";
import type { IPasswordHasher } from "../services";

export type { IUserRepository, IPasswordHasher };

/**
 * Injection token for IUserRepository.
 * Interfaces are erased at runtime, so symbols are used as DI tokens.
 */
export const USER_REPOSITORY = Symbol.for("IUserRepository");

/**
 * Injection token for IPasswordHasher.
 */
export const PASSWORD_HASHER = Symbol.for("IPasswordHasher");

