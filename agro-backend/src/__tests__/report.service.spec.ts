import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../services/ReportService';
import { ReportRepository } from '../repositories/ReportRepository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportService', () => {
  let reportService: ReportService;
  let reportRepository: ReportRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(ReportRepository),
          useValue: {
            countTotalFazendas: jest.fn(),
            getTotalHectares: jest.fn(),
          },
        },
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
    reportRepository = module.get<ReportRepository>(getRepositoryToken(ReportRepository));
  });

  it('deve retornar o total de fazendas corretamente', async () => {
    jest.spyOn(reportRepository, 'countTotalFazendas').mockResolvedValue(10);
    const total = await reportService.totalFazendas();
    expect(total).toBe(10);
  });

  it('deve retornar o total de hectares corretamente', async () => {
    jest.spyOn(reportRepository, 'getTotalHectares').mockResolvedValue(500);
    const total = await reportService.totalHectares();
    expect(total).toBe(500);
  });

  it('deve retornar 0 quando não houver fazendas cadastradas', async () => {
    jest.spyOn(reportRepository, 'countTotalFazendas').mockResolvedValue(0);
    const total = await reportService.totalFazendas();
    expect(total).toBe(0);
  });

  it('deve retornar 0 quando não houver hectares cadastrados', async () => {
    jest.spyOn(reportRepository, 'getTotalHectares').mockResolvedValue(0);
    const total = await reportService.totalHectares();
    expect(total).toBe(0);
  });

  it('deve lançar um erro se houver falha ao contar total de fazendas', async () => {
    jest.spyOn(reportRepository, 'countTotalFazendas').mockRejectedValue(new Error('Erro ao contar fazendas'));
    await expect(reportService.totalFazendas()).rejects.toThrow('Erro ao contar fazendas');
  });

  it('deve lançar um erro se houver falha ao obter total de hectares', async () => {
    jest.spyOn(reportRepository, 'getTotalHectares').mockRejectedValue(new Error('Erro ao obter hectares'));
    await expect(reportService.totalHectares()).rejects.toThrow('Erro ao obter hectares');
  });
});