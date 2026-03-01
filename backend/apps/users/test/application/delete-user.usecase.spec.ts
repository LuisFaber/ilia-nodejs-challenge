import { DeleteUserUseCase } from "../../src/application/use-cases/delete-user.usecase";
import type { IUserRepository } from "../../src/domain/repositories";
import { User } from "../../src/domain/entities";
import { Email } from "../../src/domain/value-objects";

describe("DeleteUserUseCase", () => {
  let useCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  function createMockUser() {
    return User.create({
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
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

    useCase = new DeleteUserUseCase(userRepository);
  });

  it("should delete user successfully", async () => {
    const user = createMockUser();
    userRepository.findById.mockResolvedValue(user);
    userRepository.delete.mockResolvedValue(undefined);

    await useCase.run("user-1");

    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
    expect(userRepository.delete).toHaveBeenCalledWith("user-1");
  });

  it("should throw error if user not found", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.run("user-1")).rejects.toThrow("User not found");

    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
