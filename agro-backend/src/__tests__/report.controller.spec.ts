import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../controllers/ReportController';
import { ReportService } from '../services/ReportService';

jest.mock('../services/ReportService'); // Mock do serviço

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: {
            totalFazendas: jest.fn(),
            totalHectares: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  describe('GET /reports/total-fazendas', () => {
    it('deve retornar o total de fazendas', async () => {
      // Mock de resposta do serviço
      const totalFazendas = 100;
      jest.spyOn(service, 'totalFazendas').mockResolvedValue(totalFazendas);

      const result = await controller.getTotalFazendas();

      expect(result).toEqual({ total: totalFazendas });
      expect(service.totalFazendas).toHaveBeenCalled();
    });

    it('deve lançar erro se houver falha no serviço', async () => {
        const error = new Error('Erro ao obter total de fazendas');
        jest.spyOn(service, 'totalFazendas').mockRejectedValueOnce(error);
      
        // Usando .rejects.toThrow para promessas rejeitadas
        await expect(controller.getTotalFazendas()).rejects.toThrow('Erro ao obter total de fazendas');
        expect(service.totalFazendas).toHaveBeenCalled();
      });
      
  });

  describe('GET /reports/total-hectares', () => {
    it('deve retornar o total de hectares', async () => {
      // Mock de resposta do serviço
      const totalHectares = 5000;
      jest.spyOn(service, 'totalHectares').mockResolvedValue(totalHectares);

      const result = await controller.getTotalHectares();

      expect(result).toEqual({ total: totalHectares });
      expect(service.totalHectares).toHaveBeenCalled();
    });

    it('deve lançar erro se houver falha no serviço', async () => {
      // Simula erro no serviço
      const error = new Error('Database error');
      jest.spyOn(service, 'totalHectares').mockRejectedValueOnce(error);

      // Usando .rejects.toThrow para promessas rejeitadas
      await expect(controller.getTotalHectares()).rejects.toThrow('Database error');
      expect(service.totalHectares).toHaveBeenCalled();
    });
  });
});
