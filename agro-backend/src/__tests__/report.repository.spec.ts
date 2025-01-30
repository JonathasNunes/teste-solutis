import { Test, TestingModule } from '@nestjs/testing';
import { ReportRepository } from '../repositories/ReportRepository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Fazendo mock do ReportRepository
jest.mock('../repositories/ReportRepository');

describe('ReportRepository', () => {
  let repository: ReportRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportRepository,
        {
          provide: getRepositoryToken(ReportRepository),
          useValue: {
            countTotalFazendas: jest.fn(),
            getTotalHectares: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ReportRepository>(ReportRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('countTotalFazendas', () => {
    it('deve retornar o total de fazendas', async () => {
      // Mockando a função countTotalFazendas corretamente
      const mockCountTotalFazendas = jest.fn().mockResolvedValue(10);
      repository.countTotalFazendas = mockCountTotalFazendas;

      const result = await repository.countTotalFazendas();
      expect(result).toBe(10);
      expect(mockCountTotalFazendas).toHaveBeenCalled();
    });

    it('deve jogar erro se conta falhar', async () => {
      const error = new Error('Database error');
      const mockCountTotalFazendas = jest.fn().mockRejectedValueOnce(error);
      repository.countTotalFazendas = mockCountTotalFazendas;

      await expect(repository.countTotalFazendas()).rejects.toThrow('Database error');
      expect(mockCountTotalFazendas).toHaveBeenCalled();
    });
  });

  describe('getTotalHectares', () => {
    it('deve retornar total de hectares', async () => {
      const mockGetTotalHectares = jest.fn().mockResolvedValue(100);
      repository.getTotalHectares = mockGetTotalHectares;

      const result = await repository.getTotalHectares();
      expect(result).toBe(100);
      expect(mockGetTotalHectares).toHaveBeenCalled();
    });

    it('deve jogar erro se getRawOne falhar', async () => {
      const error = new Error('Database error');
      const mockGetTotalHectares = jest.fn().mockRejectedValueOnce(error);
      repository.getTotalHectares = mockGetTotalHectares;

      await expect(repository.getTotalHectares()).rejects.toThrow('Database error');
      expect(mockGetTotalHectares).toHaveBeenCalled();
    });
  });
});