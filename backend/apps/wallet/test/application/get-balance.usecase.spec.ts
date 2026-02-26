import { GetBalanceUseCase } from "@application/use-cases/get-balance.usecase";
import type { ITransactionRepository } from "@domain/ports";
import { TRANSACTION_REPOSITORY } from "@domain/ports";
import { Test, TestingModule } from "@nestjs/testing";

describe("GetBalanceUseCase", () => {
  let useCase: GetBalanceUseCase;
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
        GetBalanceUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(GetBalanceUseCase);
  });

  it("should return correct balance", async () => {
    // Arrange
    const userId = "user-1";
    const expectedBalance = 150;
    mockRepository.getBalance.mockResolvedValue(expectedBalance);

    // Act
    const result = await useCase.run(userId);

    // Assert
    expect(mockRepository.getBalance).toHaveBeenCalledTimes(1);
    expect(mockRepository.getBalance).toHaveBeenCalledWith(userId);
    expect(result).toBe(expectedBalance);
  });
});
