import { UpdateUserUseCase } from "../../src/application/use-cases/update-user.usecase";
import type { IUserRepository } from "../../src/domain/repositories";
import type { IPasswordHasher } from "../../src/domain/services";
import { User } from "../../src/domain/entities";
import { Email } from "../../src/domain/value-objects";
import { PASSWORD_HASHER } from "../../src/domain/ports";

describe("UpdateUserUseCase", () => {
  let useCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;

  function createMockUser(overrides?: { id?: string; firstName?: string; lastName?: string }) {
    return User.create({
      id: overrides?.id ?? "user-1",
      firstName: overrides?.firstName ?? "John",
      lastName: overrides?.lastName ?? "Doe",
      email: Email.create("john@example.com"),
      passwordHash: "hashed",
      language: "en",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    passwordHasher = { hash: jest.fn().mockResolvedValue("hashed") } as any;

    useCase = new UpdateUserUseCase(userRepository, passwordHasher);
  });

  it("should update user successfully", async () => {
    const existing = createMockUser();
    userRepository.findById.mockResolvedValue(existing);
    userRepository.update.mockResolvedValue(undefined);

    const result = await useCase.run({
      id: "user-1",
      firstName: "Jane",
      lastName: "Smith",
    });

    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(result.firstName).toBe("Jane");
    expect(result.lastName).toBe("Smith");
    expect(result.email.value).toBe("john@example.com");
    expect(result.language).toBe("en");
  });

  it("should throw error if user not found", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.run({ id: "user-1", firstName: "Jane" })
    ).rejects.toThrow("User not found");

    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
