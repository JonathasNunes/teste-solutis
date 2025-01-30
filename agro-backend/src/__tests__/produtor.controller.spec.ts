import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorController } from '../controllers/ProdutorController';
import { ProdutorService } from '../services/ProdutorService';
import { Produtor } from '../entities/Produtor';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProdutorController', () => {
  let controller: ProdutorController;
  let service: ProdutorService;
  let repository: Repository<Produtor>;

  // Mock para os dados de produtores
  const produtoresMock = [
    {
      id: 1,
      cpf_cnpj: '12345678000195',
      nome: 'Produtor A',
      propriedades: [],
    },
    {
      id: 2,
      cpf_cnpj: '98765432000195',
      nome: 'Produtor B',
      propriedades: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutorController],
      providers: [
        ProdutorService,
        {
          provide: getRepositoryToken(Produtor),
          useClass: Repository, // Usando o Repository padrão do TypeORM para mockar o repositório
        },
        {
          provide: ProdutorService,
          useValue: {
            listarTodos: jest.fn().mockResolvedValue(produtoresMock),
            cadastrarProdutor: jest.fn(),
            atualizarProdutor: jest.fn(),
            buscarPorId: jest.fn(),
            excluirProdutor: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutorController>(ProdutorController);
    service = module.get<ProdutorService>(ProdutorService);
    repository = module.get<Repository<Produtor>>(getRepositoryToken(Produtor)); // Pegando o repositório mockado
  });

  it('deve listar todos os produtores', async () => {
    const produtores = await controller.listarTodos();
    expect(produtores).toEqual(produtoresMock);
    expect(service.listarTodos).toHaveBeenCalled();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('criarProdutor', () => {
    it('deve criar um produtor', async () => {
      const produtorMock = { id: 1, cpf_cnpj: '12345678901', nome: 'João Silva' };
      jest.spyOn(service, 'cadastrarProdutor').mockResolvedValue(produtorMock as Produtor);

      const result = await controller.criarProdutor({ cpfCnpj: '12345678901', nome: 'João Silva' });

      expect(result).toEqual(produtorMock);
      expect(service.cadastrarProdutor).toHaveBeenCalledWith('12345678901', 'João Silva');
    });

    it('deve jogar um erro se CPF for invalido', async () => {
      jest.spyOn(service, 'cadastrarProdutor').mockRejectedValue(new Error('CPF ou CNPJ inválido.'));

      await expect(controller.criarProdutor({ cpfCnpj: 'invalidcpf', nome: 'João Silva' }))
        .rejects
        .toThrow('CPF ou CNPJ inválido.');
    });
  });

  describe('atualizarProdutor', () => {
    it('deve atualizar um produtor', async () => {
      const produtorMock = { id: 1, cpf_cnpj: '12345678901', nome: 'João Silva' };
      jest.spyOn(service, 'atualizarProdutor').mockResolvedValue(produtorMock as Produtor);

      const result = await controller.atualizarProdutor(1, { nome: 'João da Silva' });

      expect(result).toEqual(produtorMock);
      expect(service.atualizarProdutor).toHaveBeenCalledWith(1, { nome: 'João da Silva' });
    });

    it('deve jogar erro se CPF for invalido', async () => {
      jest.spyOn(service, 'atualizarProdutor').mockRejectedValue(new Error('CPF ou CNPJ inválido.'));

      await expect(controller.atualizarProdutor(1, { cpf_cnpj: 'invalidcpf' }))
        .rejects
        .toThrow('CPF ou CNPJ inválido.');
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar um produtor por id', async () => {
      const produtorMock = { id: 1, cpf_cnpj: '12345678901', nome: 'João Silva' };
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(produtorMock as Produtor);

      const result = await controller.buscarPorId(1);

      expect(result).toEqual(produtorMock);
      expect(service.buscarPorId).toHaveBeenCalledWith(1);
    });

    it('deve retornar undefined se produtor não for encontrado', async () => {
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(undefined);

      const result = await controller.buscarPorId(999);

      expect(result).toBeUndefined();
      expect(service.buscarPorId).toHaveBeenCalledWith(999);
    });
  });

  describe('excluirProdutor', () => {
    it('deve excluir um produtor', async () => {
      jest.spyOn(service, 'excluirProdutor').mockResolvedValue(undefined);

      await expect(controller.excluirProdutor(1)).resolves.not.toThrow();
      expect(service.excluirProdutor).toHaveBeenCalledWith(1);
    });

    it('deve jogar erro se produtor não for encontrado para exclusao', async () => {
      jest.spyOn(service, 'excluirProdutor').mockRejectedValue(new Error('Produtor não encontrado.'));

      await expect(controller.excluirProdutor(999))
        .rejects
        .toThrow('Produtor não encontrado.');
    });
  });
});