import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorRepository } from '../repositories/ProdutorRepository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produtor } from '../entities/Produtor';
import { Repository } from 'typeorm';

jest.mock('../repositories/ProdutorRepository');

describe('ProdutorRepository', () => {
  let repository: ProdutorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutorRepository,
        {
          provide: getRepositoryToken(ProdutorRepository),
          useValue: {
            findByCpfCnpj: jest.fn(),
            createProdutor: jest.fn(),
            updateProdutor: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            deleteProdutor: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ProdutorRepository>(ProdutorRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByCpfCnpj', () => {
    it('deve retornar um produtor', async () => {
      const mockProdutor = { id: 1, cpf_cnpj: '12345678900' } as Produtor;
      const mockFindByCpfCnpj = jest.fn().mockResolvedValue(mockProdutor);
      repository.findByCpfCnpj = mockFindByCpfCnpj;

      const result = await repository.findByCpfCnpj('12345678900');
      expect(result).toEqual(mockProdutor);
      expect(mockFindByCpfCnpj).toHaveBeenCalledWith('12345678900');
    });
  });

  describe('createProdutor', () => {
    it('deve criar e retornar um produtor', async () => {
      const mockProdutor = { id: 1, cpf_cnpj: '12345678900' } as Produtor;
      const mockCreateProdutor = jest.fn().mockResolvedValue(mockProdutor);
      repository.createProdutor = mockCreateProdutor;

      const result = await repository.createProdutor(mockProdutor);
      expect(result).toEqual(mockProdutor);
      expect(mockCreateProdutor).toHaveBeenCalledWith(mockProdutor);
    });
  });

  describe('updateProdutor', () => {
    it('deve atualizar e retornar um produtor', async () => {
      const mockProdutor = { id: 1, cpf_cnpj: '12345678900' } as Produtor;
      const mockUpdateProdutor = jest.fn().mockResolvedValue(mockProdutor);
      repository.updateProdutor = mockUpdateProdutor;

      const result = await repository.updateProdutor(1, mockProdutor);
      expect(result).toEqual(mockProdutor);
      expect(mockUpdateProdutor).toHaveBeenCalledWith(1, mockProdutor);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de produtores', async () => {
      const mockProdutores = [{ id: 1 }, { id: 2 }] as Produtor[];
      const mockFindAll = jest.fn().mockResolvedValue(mockProdutores);
      repository.findAll = mockFindAll;

      const result = await repository.findAll();
      expect(result).toEqual(mockProdutores);
      expect(mockFindAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('deve retornar um produtor por ID', async () => {
      const mockProdutor = { id: 1 } as Produtor;
      const mockFindById = jest.fn().mockResolvedValue(mockProdutor);
      repository.findById = mockFindById;

      const result = await repository.findById(1);
      expect(result).toEqual(mockProdutor);
      expect(mockFindById).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteProdutor', () => {
    it('deve excluir um produtor', async () => {
      const mockDeleteProdutor = jest.fn().mockResolvedValue(undefined);
      repository.deleteProdutor = mockDeleteProdutor;

      await repository.deleteProdutor(1);
      expect(mockDeleteProdutor).toHaveBeenCalledWith(1);
    });
  });
});