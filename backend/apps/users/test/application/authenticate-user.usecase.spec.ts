import { AuthenticateUserUseCase } from "../../src/application/use-cases/authenticate-user.usecase";
import type { IUserRepository } from "../../src/domain/repositories";
import type { IPasswordHasher } from "../../src/domain/services";
import { User } from "../../src/domain/entities";
import { Email } from "../../src/domain/value-objects";

describe("AuthenticateUserUseCase", () => {
  let useCase: AuthenticateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;

  const input = {
    email: "john@example.com",
    password: "secret123",
  };

  function createMockUser() {
    return User.create({
      id: "user-1",
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

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    useCase = new AuthenticateUserUseCase(userRepository, passwordHasher);
  });

  it("should authenticate successfully", async () => {
    const user = createMockUser();
    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);

    const result = await useCase.run(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(passwordHasher.compare).toHaveBeenCalledWith("secret123", "hashed");
    expect(result.user).toBe(user);
    expect(result.payload).toEqual({ sub: "user-1", email: "john@example.com" });
  });

  it("should throw error if user not found", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.run(input)).rejects.toThrow("Invalid credentials");

    expect(userRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it("should throw error if password invalid", async () => {
    const user = createMockUser();
    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.run(input)).rejects.toThrow("Invalid credentials");

    expect(passwordHasher.compare).toHaveBeenCalledWith("secret123", "hashed");
  });

  it("should call passwordHasher.compare", async () => {
    const user = createMockUser();
    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);

    await useCase.run(input);

    expect(passwordHasher.compare).toHaveBeenCalledTimes(1);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      input.password,
      user.password
    );
  });
});
