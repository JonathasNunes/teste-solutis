import { Test, TestingModule } from '@nestjs/testing';
import { CulturaService } from '../services/CulturaService';
import { CulturaRepository } from '../repositories/CulturaRepository';
import { Cultura } from '../entities/Cultura';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Propriedade } from '../entities/Propriedade';
import { Repository } from 'typeorm';

jest.mock('../repositories/CulturaRepository');
jest.mock('../validators/CulturaValidator');

describe('CulturaService', () => {
  let service: CulturaService;
  let culturaRepository: Repository<Cultura>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturaService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    culturaRepository = module.get<Repository<Cultura>>(getRepositoryToken(Cultura));
  });

  it('deve listar todas as culturas', async () => {
    const culturas = [{ id: 1, nome: 'Milho', safra: '2023' } as Cultura];
    jest.spyOn(culturaRepository, 'find').mockResolvedValue(culturas);

    const result = await service.listarTodas();
    expect(result).toEqual(culturas);
    expect(culturaRepository.find).toHaveBeenCalledWith({ relations: ['propriedade'] });
  });

  it('deve buscar cultura por ID', async () => {
    const cultura = { id: 1, nome: 'Milho', safra: '2023' } as Cultura;
    jest.spyOn(culturaRepository, 'findOne').mockResolvedValue(cultura);

    const result = await service.buscarPorId(1);
    expect(result).toEqual(cultura);
    expect(culturaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['propriedade'] });
  });

  it('deve criar uma nova cultura', async () => {
    const culturaData = { 
        nome: 'Soja', 
        safra: '2024', 
        propriedade: { id: 1 } as unknown as Propriedade 
    };

    const novaCultura = { id: 1, ...culturaData } as Cultura;

    jest.spyOn(culturaRepository, 'create').mockReturnValue(novaCultura);
    jest.spyOn(culturaRepository, 'save').mockResolvedValue(novaCultura);

    const result = await service.criar(culturaData);

    expect(result).toEqual(novaCultura);
    expect(culturaRepository.create).toHaveBeenCalledWith(culturaData);
    expect(culturaRepository.save).toHaveBeenCalledWith(novaCultura);
  });

  it('deve lançar erro ao tentar criar cultura sem propriedade', async () => {
    await expect(service.criar({ nome: 'Arroz', safra: '2025' } as any))
      .rejects.toThrow('O ID da propriedade é obrigatório para cadastrar uma cultura.');
  });

  it('deve alterar uma cultura existente', async () => {
    const culturaExistente = { id: 1, nome: 'Milho', safra: '2023' } as Cultura;
    jest.spyOn(service, 'buscarPorId').mockResolvedValue(culturaExistente);
    jest.spyOn(culturaRepository, 'save').mockResolvedValue({ ...culturaExistente, nome: 'Trigo' });

    const result = await service.alterar(1, { nome: 'Trigo' });
    expect(result.nome).toBe('Trigo');
    expect(culturaRepository.save).toHaveBeenCalledWith({ ...culturaExistente, nome: 'Trigo' });
  });

  it('deve lançar erro ao tentar alterar cultura inexistente', async () => {
    jest.spyOn(service, 'buscarPorId').mockResolvedValue(undefined);

    await expect(service.alterar(999, { nome: 'Trigo' }))
      .rejects.toThrow('Cultura não encontrada.');
  });

  it('deve deletar uma cultura por ID', async () => {
    jest.spyOn(culturaRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

    await expect(service.deletar(1)).resolves.toBeUndefined();
    expect(culturaRepository.delete).toHaveBeenCalledWith(1);
  });
});