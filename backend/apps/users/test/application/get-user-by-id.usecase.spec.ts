import { GetUserByIdUseCase } from "../../src/application/use-cases/get-user-by-id.usecase";
import type { IUserRepository } from "../../src/domain/repositories";
import { User } from "../../src/domain/entities";
import { Email } from "../../src/domain/value-objects";

describe("GetUserByIdUseCase", () => {
  let useCase: GetUserByIdUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  function createMockUser(id = "user-1") {
    return User.create({
      id,
      firstName: "John",
      lastName: "Doe",
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

    useCase = new GetUserByIdUseCase(userRepository);
  });

  it("should return user successfully", async () => {
    const user = createMockUser();
    userRepository.findById.mockResolvedValue(user);

    const result = await useCase.run("user-1");

    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
    expect(result).toBe(user);
  });

  it("should throw error if user not found", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.run("user-1")).rejects.toThrow("User not found");

    expect(userRepository.findById).toHaveBeenCalledWith("user-1");
  });
});
