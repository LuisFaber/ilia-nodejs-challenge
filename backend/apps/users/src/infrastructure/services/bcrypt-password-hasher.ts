import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";
import type { IPasswordHasher } from "../../domain/services";

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcryptHash(password, SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcryptCompare(password, hash);
  }
}
