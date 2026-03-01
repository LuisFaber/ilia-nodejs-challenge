import { CreateUserUseCase } from "../../src/application/use-cases/create-user.usecase";
import type { IUserRepository } from "../../src/domain/repositories";
import type { IPasswordHasher } from "../../src/domain/services";
import { User } from "../../src/domain/entities";
import { Email } from "../../src/domain/value-objects";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;

  const input = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "secret123",
  };

  function createMockUser(overrides?: Partial<{ id: string }>) {
    return User.create({
      id: overrides?.id ?? "user-1",
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

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(userRepository, passwordHasher);
  });

  it("should create user successfully", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue("hashed");
    const savedUser = createMockUser();
    userRepository.create.mockResolvedValue(savedUser);

    const result = await useCase.run(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(passwordHasher.hash).toHaveBeenCalledWith("secret123");
    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(savedUser);
  });

  it("should hash password before saving", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue("hashed");
    userRepository.create.mockImplementation(async (u) => u);

    await useCase.run(input);

    expect(passwordHasher.hash).toHaveBeenCalledWith(input.password);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed",
      })
    );
  });

  it("should throw error if email already exists", async () => {
    const existing = createMockUser();
    userRepository.findByEmail.mockResolvedValue(existing);

    await expect(useCase.run(input)).rejects.toThrow("Email already registered");

    expect(userRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("should call repository.create", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue("hashed");
    userRepository.create.mockImplementation(async (u) => u);

    await useCase.run(input);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    const createdUser = userRepository.create.mock.calls[0][0];
    expect(createdUser.firstName).toBe("John");
    expect(createdUser.lastName).toBe("Doe");
    expect(createdUser.email.value).toBe("john@example.com");
  });

  it("should call passwordHasher.hash", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue("hashed");
    userRepository.create.mockImplementation(async (u) => u);

    await useCase.run(input);

    expect(passwordHasher.hash).toHaveBeenCalledTimes(1);
    expect(passwordHasher.hash).toHaveBeenCalledWith("secret123");
  });
});
