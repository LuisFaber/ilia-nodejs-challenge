import { CreateTransactionUseCase } from "@application/use-cases/create-transaction.usecase";
import type { ITransactionContext, ITransactionRepository } from "@domain/ports";
import { Transaction } from "@domain/entities/transaction";
import { TRANSACTION_REPOSITORY } from "@domain/ports";
import { Test, TestingModule } from "@nestjs/testing";

describe("CreateTransactionUseCase", () => {
  let useCase: CreateTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  const userId = "user-1";
  const mockCtx: ITransactionContext = {
    getBalanceLocked: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      getBalance: jest.fn(),
      runInTransaction: jest.fn(),
    };
    mockRepository.runInTransaction.mockImplementation(async (fn) => {
      return fn(mockCtx);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(CreateTransactionUseCase);
  });

  it("should create credit correctly", async () => {
    // Arrange
    (mockCtx.getBalanceLocked as jest.Mock).mockResolvedValue(100);
    (mockCtx.save as jest.Mock).mockResolvedValue(undefined);

    // Act
    const result = await useCase.run({
      userId,
      amount: 50,
      type: "credit",
      description: "Deposit",
    });

    // Assert
    expect(mockRepository.runInTransaction).toHaveBeenCalledTimes(1);
    expect(mockCtx.getBalanceLocked).toHaveBeenCalledWith(userId);
    expect(mockCtx.save).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Transaction);
    expect(result.isCredit()).toBe(true);
    expect(result.amount.value).toBe(50);
    expect(result.userId).toBe(userId);
  });

  it("should create debit correctly", async () => {
    // Arrange
    (mockCtx.getBalanceLocked as jest.Mock).mockResolvedValue(100);
    (mockCtx.save as jest.Mock).mockResolvedValue(undefined);

    // Act
    const result = await useCase.run({
      userId,
      amount: 30,
      type: "debit",
      description: "Withdrawal",
    });

    // Assert
    expect(mockRepository.runInTransaction).toHaveBeenCalledTimes(1);
    expect(mockCtx.getBalanceLocked).toHaveBeenCalledWith(userId);
    expect(mockCtx.save).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Transaction);
    expect(result.isDebit()).toBe(true);
    expect(result.amount.value).toBe(30);
    expect(result.userId).toBe(userId);
  });

  it("should prevent debit when balance is insufficient", async () => {
    // Arrange
    (mockCtx.getBalanceLocked as jest.Mock).mockResolvedValue(5);
    (mockCtx.save as jest.Mock).mockResolvedValue(undefined);

    // Act & Assert
    await expect(
      useCase.run({
        userId,
        amount: 10,
        type: "debit",
        description: "Withdrawal",
      })
    ).rejects.toThrow("Insufficient balance for debit");

    expect(mockRepository.runInTransaction).toHaveBeenCalledTimes(1);
    expect(mockCtx.getBalanceLocked).toHaveBeenCalledWith(userId);
    expect(mockCtx.save).not.toHaveBeenCalled();
  });

  it("should guarantee runInTransaction is called", async () => {
    // Arrange
    (mockCtx.getBalanceLocked as jest.Mock).mockResolvedValue(0);
    (mockCtx.save as jest.Mock).mockResolvedValue(undefined);

    // Act
    await useCase.run({
      userId,
      amount: 25,
      type: "credit",
      description: "Deposit",
    });

    // Assert
    expect(mockRepository.runInTransaction).toHaveBeenCalledTimes(1);
    expect(mockRepository.runInTransaction).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });
});
