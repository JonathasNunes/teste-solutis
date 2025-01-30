import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadeController } from '../controllers/PropriedadeController';
import { PropriedadeService } from '../services/PropriedadeService';
import { ProdutorService } from '../services/ProdutorService';
import { CulturaService } from '../services/CulturaService';
import { Propriedade } from '../entities/Propriedade';

describe('PropriedadeController', () => {
  let controller: PropriedadeController;
  let propriedadeService: PropriedadeService;
  let produtorService: ProdutorService;
  let culturaService: CulturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropriedadeController],
      providers: [
        {
          provide: PropriedadeService,
          useValue: {
            cadastrarPropriedade: jest.fn(),
            listarTodos: jest.fn(),
            buscarPorId: jest.fn(),
            buscaPropriedadesPorProdutor: jest.fn(),
            atualizarPropriedade: jest.fn(),
            excluirPropriedade: jest.fn(),
          },
        },
        {
          provide: ProdutorService,
          useValue: {
            buscarPorId: jest.fn(),
          },
        },
        {
          provide: CulturaService,
          useValue: {
            criar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PropriedadeController>(PropriedadeController);
    propriedadeService = module.get<PropriedadeService>(PropriedadeService);
    produtorService = module.get<ProdutorService>(ProdutorService);
    culturaService = module.get<CulturaService>(CulturaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('cadastrarPropriedade', () => {
    it('deve jogar erro se ID do produtor não for encontrado', async () => {
      await expect(controller.cadastrarPropriedade({} as Partial<Propriedade>))
        .rejects.toThrow('O ID do produtor é obrigatório para associar uma propriedade.');
    });

    it('deve jogar erro se  produtor não for encontrado', async () => {
      jest.spyOn(produtorService, 'buscarPorId').mockResolvedValue(null);
      await expect(controller.cadastrarPropriedade({ produtor: { id: 1 } } as Partial<Propriedade>))
        .rejects.toThrow('Produtor não encontrado.');
    });
  });

  describe('listarTodos', () => {
    it('deve retornar todas as propriedades', async () => {
      const mockPropriedades = [{ id: 1 }, { id: 2 }];
      jest.spyOn(propriedadeService, 'listarTodos').mockResolvedValue(mockPropriedades as Propriedade[]);
      const result = await controller.listarTodos();
      expect(result).toEqual(mockPropriedades);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar uma propriedade por ID', async () => {
      const mockPropriedade = { id: 1 } as Propriedade;
      jest.spyOn(propriedadeService, 'buscarPorId').mockResolvedValue(mockPropriedade);
      const result = await controller.buscarPorId(1);
      expect(result).toEqual(mockPropriedade);
    });
  });

  describe('atualizarPropriedade', () => {
    it('deve atualizar uma propriedade', async () => {
      const mockUpdated = { id: 1 } as Propriedade;
      jest.spyOn(propriedadeService, 'atualizarPropriedade').mockResolvedValue(mockUpdated);
      const result = await controller.atualizarPropriedade(1, {});
      expect(result).toEqual(mockUpdated);
    });

    it('deve jogar erro se produtor nao for encontrado', async () => {
        jest.spyOn(produtorService, 'buscarPorId').mockResolvedValue(null);
        await expect(
          controller.atualizarPropriedade(1, { produtor: { id: 999 } } as Partial<Propriedade>)
        ).rejects.toThrow('Produtor não encontrado.');
    });
  
    it('deve jogar erro se atualizar falhar', async () => {
        jest.spyOn(propriedadeService, 'atualizarPropriedade').mockRejectedValue(new Error('Database error'));
        await expect(controller.atualizarPropriedade(1, { nome: 'Teste' })).rejects.toThrow('Database error');
    });
  });

  describe('excluirPropriedade', () => {
    it('deve excluir uma propriedade', async () => {
      jest.spyOn(propriedadeService, 'excluirPropriedade').mockResolvedValue(undefined);
      await expect(controller.excluirPropriedade(1)).resolves.toBeUndefined();
    });

    it('deve jogar erro se excluir falhar', async () => {
        jest.spyOn(propriedadeService, 'excluirPropriedade').mockRejectedValue(new Error('Database error'));
        await expect(controller.excluirPropriedade(1)).rejects.toThrow('Database error');
    });
  });
});