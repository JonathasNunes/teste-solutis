import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadeRepository } from '../repositories/PropriedadeRepository';
import { Propriedade } from '../entities/Propriedade';

describe('PropriedadeRepository', () => {
  let repository: PropriedadeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropriedadeRepository,
        {
          provide: 'ProdutorService', // Adicione o mock do serviço que você usa
          useValue: {
            buscarPorId: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PropriedadeRepository>(PropriedadeRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByProdutor', () => {
    it('deve retornar um array vazio se nao houver propriedades para o produtor', async () => {
        // Mock da função find para retornar um array vazio
        jest.spyOn(repository, 'find').mockResolvedValue([]);
  
        // Chama a função e verifica se ela retorna um array vazio
        const result = await repository.findByProdutor(999);
        expect(result).toEqual([]);  // Verifica que a resposta é um array vazio
    });
  
    it('deve retornar propriedades se encontrar o produtor', async () => {
        // Mock da função find para retornar um array com propriedades
        const mockPropriedades = [
          { id: 1, produtor: { id: 999 }, nome: 'Propriedade 1', culturas: [] } as Propriedade,
          { id: 2, produtor: { id: 999 }, nome: 'Propriedade 2', culturas: [] } as Propriedade,
        ];
        jest.spyOn(repository, 'find').mockResolvedValue(mockPropriedades);
  
        // Chama a função e verifica se as propriedades são retornadas corretamente
        const result = await repository.findByProdutor(999);
        expect(result).toEqual(mockPropriedades);  // Verifica se o retorno é o esperado
      });
  });

  describe('createPropriedade', () => {
    it('deve criar uma nova propriedade', async () => {
      const propriedadeData = {
        nome: 'Nova Propriedade',
        produtor: { id: 1 },
        cidade: 'Cidade Teste',
        estado: 'Estado Teste',
        area_total: 100,
        area_agricultavel: 80,
        area_vegetacao: 20,
        culturas: [],
      } as Propriedade;

      const mockPropriedade = { id: 1, ...propriedadeData };

      jest.spyOn(repository, 'create').mockReturnValue(mockPropriedade as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockPropriedade);

      const result = await repository.createPropriedade(propriedadeData);

      expect(result).toEqual(mockPropriedade);
      expect(repository.save).toHaveBeenCalledWith(mockPropriedade);
    });
  });

  describe('updatePropriedade', () => {
    it('deve atualizar uma propriedade', async () => {
      const updatedData = { nome: 'Propriedade Atualizada' };
      const mockPropriedade = {
        id: 1,
        produtor: { id: 1 },
        nome: 'Propriedade A',
        cidade: 'Cidade A',
        estado: 'Estado A',
        area_total: 100,
        area_agricultavel: 80,
        area_vegetacao: 20,
        culturas: [],
      } as Propriedade;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPropriedade);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockPropriedade, ...updatedData });

      const result = await repository.updatePropriedade(1, updatedData);

      expect(result).toEqual({ ...mockPropriedade, ...updatedData });
      expect(repository.save).toHaveBeenCalledWith({ ...mockPropriedade, ...updatedData });
    });

    it('deve jogar erro se propriedade nao for encontrada', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(repository.updatePropriedade(999, { nome: 'Propriedade Inexistente' })).rejects.toThrow('Propriedade não encontrada.');
    });
  });

  describe('deletePropriedade', () => {
    it('deve excluir uma propriedade', async () => {
      const mockPropriedade = {
        id: 1,
        produtor: { id: 1 },
        nome: 'Propriedade A',
        cidade: 'Cidade A',
        estado: 'Estado A',
        area_total: 100,
        area_agricultavel: 80,
        area_vegetacao: 20,
        culturas: [],
      } as Propriedade;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPropriedade);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await expect(repository.deletePropriedade(1)).resolves.toBeUndefined();
      expect(repository.remove).toHaveBeenCalledWith(mockPropriedade);
    });

    it('deve jogar erro se excluir falhar', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(repository.deletePropriedade(999)).rejects.toThrow('Propriedade não encontrada.');
    });
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