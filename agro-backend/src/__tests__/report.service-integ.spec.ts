import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../services/ReportService';
import { ReportRepository } from '../repositories/ReportRepository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportService', () => {
  let reportService: ReportService;
  let repositoryMock: Partial<ReportRepository>;

  beforeEach(async () => {
    repositoryMock = {
      countTotalFazendas: jest.fn().mockResolvedValue(10),
      getTotalHectares: jest.fn().mockResolvedValue(100),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(ReportRepository),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(reportService).toBeDefined();
  });

  describe('totalFazendas', () => {
    it('deve retornar total de fazendas', async () => {
      const result = await reportService.totalFazendas();
      expect(result).toBe(10);
      expect(repositoryMock.countTotalFazendas).toHaveBeenCalled();
    });
  });

  describe('totalHectares', () => {
    it('deve retornar total de hectares', async () => {
      const result = await reportService.totalHectares();
      expect(result).toBe(100);
      expect(repositoryMock.getTotalHectares).toHaveBeenCalled();
    });
  });
});
