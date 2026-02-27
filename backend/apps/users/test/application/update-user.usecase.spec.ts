import { UpdateUserUseCase } from "../../src/application/use-cases/update-user.usecase";
import type { IUserRepository } from "../../src/domain/repositories";
import { User } from "../../src/domain/entities";
import { Email } from "../../src/domain/value-objects";

describe("UpdateUserUseCase", () => {
  let useCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  function createMockUser(overrides?: { id?: string; firstName?: string; lastName?: string }) {
    return User.create({
      id: overrides?.id ?? "user-1",
      firstName: overrides?.firstName ?? "John",
      lastName: overrides?.lastName ?? "Doe",
      email: Email.create("john@example.com"),
      passwordHash: "hashed",
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

    useCase = new UpdateUserUseCase(userRepository);
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
