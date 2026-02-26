import { ListTransactionsUseCase } from "@application/use-cases/list-transactions.usecase";
import type { ITransactionRepository } from "@domain/ports";
import { Transaction } from "@domain/entities/transaction";
import { Amount } from "@domain/value-objects/amount";
import { TRANSACTION_REPOSITORY } from "@domain/ports";
import { Test, TestingModule } from "@nestjs/testing";

describe("ListTransactionsUseCase", () => {
  let useCase: ListTransactionsUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      getBalance: jest.fn(),
      runInTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTransactionsUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(ListTransactionsUseCase);
  });

  it("should return list of transactions", async () => {
    // Arrange
    const userId = "user-1";
    const createdAt = new Date("2025-01-15T10:00:00Z");
    const transactions = [
      Transaction.createCredit("id-1", userId, Amount.create(100), createdAt),
      Transaction.createDebit(
        "id-2",
        userId,
        Amount.create(30),
        new Date("2025-01-16T10:00:00Z"),
        100
      ),
    ];
    mockRepository.findByUserId.mockResolvedValue(transactions);

    // Act
    const result = await useCase.run(userId);

    // Assert
    expect(mockRepository.findByUserId).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Transaction);
    expect(result[0].id).toBe("id-1");
    expect(result[0].userId).toBe(userId);
    expect(result[0].amount.value).toBe(100);
    expect(result[0].isCredit()).toBe(true);
    expect(result[1].id).toBe("id-2");
    expect(result[1].isDebit()).toBe(true);
    expect(result[1].amount.value).toBe(30);
  });
});
