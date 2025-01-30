import { Test, TestingModule } from '@nestjs/testing';
import { CulturaController } from '../controllers/CulturaController';
import { CulturaService } from '../services/CulturaService';
import { Cultura } from '../entities/Cultura';
import { Propriedade } from '../entities/Propriedade';
import { NotFoundException } from '@nestjs/common';

describe('CulturaController', () => {
  let controller: CulturaController;
  let service: CulturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturaController],
      providers: [
        {
          provide: CulturaService,
          useValue: {
            listarTodas: jest.fn(),
            buscarPorId: jest.fn(),
            criar: jest.fn(),
            alterar: jest.fn(),
            deletar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CulturaController>(CulturaController);
    service = module.get<CulturaService>(CulturaService);
  });

  describe('listarTodas', () => {
    it('deve retornar um array de culturas', async () => {
      const mockCulturas: Cultura[] = [
        { id: 1, nome: 'Cultura 1', safra: '2023/2024', propriedade: new Propriedade() },
        { id: 2, nome: 'Cultura 2', safra: '2023/2024', propriedade: new Propriedade() },
      ];

      jest.spyOn(service, 'listarTodas').mockResolvedValue(mockCulturas);

      const result = await controller.listarTodas();
      expect(result).toEqual(mockCulturas);
    });

    it('deve retornar um array vazio se nenhuma cultura for encontrada', async () => {
      jest.spyOn(service, 'listarTodas').mockResolvedValue([]);

      const result = await controller.listarTodas();
      expect(result).toEqual([]);
    });

    it('deve lidar com erro se if listarTodas falhar', async () => {
      const errorMessage = 'Erro ao listar culturas';
      jest.spyOn(service, 'listarTodas').mockRejectedValue(new Error(errorMessage));

      try {
        await controller.listarTodas();
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar uma cultura se encontrada', async () => {
      const mockCultura: Cultura = { 
        id: 1, 
        nome: 'Cultura 1', 
        safra: '2023/2024', 
        propriedade: new Propriedade()
      };

      jest.spyOn(service, 'buscarPorId').mockResolvedValue(mockCultura);

      const result = await controller.buscarPorId(1);
      expect(result).toEqual(mockCultura);
    });

    it('deve jogar NotFoundException se cultura não for encontrada', async () => {
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(null);

      try {
        await controller.buscarPorId(999);
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.response.message).toBe('Cultura não encontrada');
      }
    });

    it('deve mostrar erro se buscarPorId falhar', async () => {
      const errorMessage = 'Erro ao buscar cultura';
      jest.spyOn(service, 'buscarPorId').mockRejectedValue(new Error(errorMessage));

      try {
        await controller.buscarPorId(1);
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('criar', () => {
    it('deve criar uma cultura e retorna-la', async () => {
      const newCulturaData: Partial<Cultura> = { 
        nome: 'Cultura 1', 
        safra: '2023/2024', 
        propriedade: new Propriedade()
      };
      const mockNewCultura = { id: 1, ...newCulturaData } as Cultura;

      jest.spyOn(service, 'criar').mockResolvedValue(mockNewCultura);

      const result = await controller.criar(newCulturaData);
      expect(result).toEqual(mockNewCultura);
    });

    it('deve mostrar erro se criar falhar', async () => {
      const errorMessage = 'Erro ao criar cultura';
      jest.spyOn(service, 'criar').mockRejectedValue(new Error(errorMessage));

      try {
        await controller.criar({ nome: 'Cultura 1', safra: '2023/2024' });
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('alterar', () => {
    it('deve atualizar e retornar a cultura', async () => {
      const updateData: Partial<Cultura> = { nome: 'Cultura Atualizada' };
      const updatedCultura = { id: 1, ...updateData, safra: '2023/2024', propriedade: new Propriedade() } as Cultura;

      jest.spyOn(service, 'alterar').mockResolvedValue(updatedCultura);

      const result = await controller.alterar(1, updateData);
      expect(result).toEqual(updatedCultura);
    });

    it('deve mostrar erro se alterar falhar', async () => {
      const errorMessage = 'Erro ao atualizar cultura';
      jest.spyOn(service, 'alterar').mockRejectedValue(new Error(errorMessage));

      try {
        await controller.alterar(1, { nome: 'Cultura Atualizada' });
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('deletar', () => {
    it('deve excluir a cultura', async () => {
      jest.spyOn(service, 'deletar').mockResolvedValue(undefined);

      await controller.deletar(1);
      expect(service.deletar).toHaveBeenCalledWith(1);
    });

    it('deve mostrar erro se excluir falhar', async () => {
      const errorMessage = 'Erro ao deletar cultura';
      jest.spyOn(service, 'deletar').mockRejectedValue(new Error(errorMessage));

      try {
        await controller.deletar(1);
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});