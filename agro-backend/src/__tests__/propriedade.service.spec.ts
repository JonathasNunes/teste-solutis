import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PropriedadeService } from '../services/PropriedadeService';
import { PropriedadeRepository } from '../repositories/PropriedadeRepository';
import { PropriedadeValidator } from '../validators/PropriedadeValidator';
import { Propriedade } from '../entities/Propriedade';

jest.mock('../repositories/PropriedadeRepository');
jest.mock('../validators/PropriedadeValidator');

describe('PropriedadeService', () => {
    let propriedadeService: PropriedadeService;
    let propriedadeRepository: PropriedadeRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PropriedadeService,
                {
                    provide: getRepositoryToken(PropriedadeRepository),
                    useClass: PropriedadeRepository,
                },
            ],
        }).compile();

        propriedadeService = module.get<PropriedadeService>(PropriedadeService);
        propriedadeRepository = module.get<PropriedadeRepository>(getRepositoryToken(PropriedadeRepository));
    });

    it('deve cadastrar uma propriedade com sucesso', async () => {
        const propriedadeMock: Propriedade = {
            id: 1,
            nome: 'Fazenda Teste',
            cidade: 'Cidade Teste',
            estado: 'Estado Teste',
            area_total: 100,
            area_agricultavel: 50,
            area_vegetacao: 50,
            produtor: { id: 1 },
            culturas: [],
        } as Propriedade;

        PropriedadeValidator.validarAreas = jest.fn().mockReturnValue(true);
        propriedadeRepository.createPropriedade = jest.fn().mockResolvedValue(propriedadeMock);

        const result = await propriedadeService.cadastrarPropriedade(propriedadeMock);
        
        expect(result).toEqual(propriedadeMock);
        expect(propriedadeRepository.createPropriedade).toHaveBeenCalledWith(propriedadeMock);
    });

    it('deve lançar erro ao cadastrar propriedade com áreas inválidas', async () => {
        const propriedadeInvalida = {
            id: 1,
            nome: 'Fazenda Teste',
            cidade: 'Cidade Teste',
            estado: 'Estado Teste',
            area_total: 100,
            area_agricultavel: 60,
            area_vegetacao: 50,
        } as Propriedade;

        PropriedadeValidator.validarAreas = jest.fn().mockReturnValue(false);
        
        await expect(propriedadeService.cadastrarPropriedade(propriedadeInvalida)).rejects.toThrow(
            'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total.'
        );
    });

    it('deve atualizar uma propriedade com sucesso', async () => {
        const id = 1;
        const updateData = { nome: 'Fazenda Atualizada' };
        const propriedadeAtualizada = { id, ...updateData } as Propriedade;

        propriedadeRepository.updatePropriedade = jest.fn().mockResolvedValue(propriedadeAtualizada);

        const result = await propriedadeService.atualizarPropriedade(id, updateData);
        
        expect(result).toEqual(propriedadeAtualizada);
        expect(propriedadeRepository.updatePropriedade).toHaveBeenCalledWith(id, updateData);
    });

    it('deve listar todas as propriedades', async () => {
        const propriedadesMock = [{ id: 1, nome: 'Fazenda 1' }, { id: 2, nome: 'Fazenda 2' }];
        propriedadeRepository.findAll = jest.fn().mockResolvedValue(propriedadesMock);

        const result = await propriedadeService.listarTodos();

        expect(result).toEqual(propriedadesMock);
        expect(propriedadeRepository.findAll).toHaveBeenCalled();
    });

    it('deve buscar uma propriedade por ID', async () => {
        const propriedadeMock = { id: 1, nome: 'Fazenda 1' } as Propriedade;
        propriedadeRepository.findById = jest.fn().mockResolvedValue(propriedadeMock);

        const result = await propriedadeService.buscarPorId(1);

        expect(result).toEqual(propriedadeMock);
        expect(propriedadeRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro ao buscar propriedade inexistente por ID', async () => {
        propriedadeRepository.findById = jest.fn().mockResolvedValue(undefined);

        await expect(propriedadeService.buscarPorId(99)).rejects.toThrow('Propriedade não encontrada.');
    });

    it('deve buscar propriedades por produtor', async () => {
        const propriedadesMock = [{ id: 1, nome: 'Fazenda 1' }];
        propriedadeRepository.findByProdutor = jest.fn().mockResolvedValue(propriedadesMock);

        const result = await propriedadeService.buscaPropriedadesPorProdutor(1);
        
        expect(result).toEqual(propriedadesMock);
        expect(propriedadeRepository.findByProdutor).toHaveBeenCalledWith(1);
    });

    it('deve excluir uma propriedade com sucesso', async () => {
        propriedadeRepository.deletePropriedade = jest.fn().mockResolvedValue(undefined);
        
        await expect(propriedadeService.excluirPropriedade(1)).resolves.toBeUndefined();
        expect(propriedadeRepository.deletePropriedade).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro ao excluir propriedade inexistente', async () => {
        propriedadeRepository.deletePropriedade = jest.fn().mockRejectedValue(new Error('Propriedade não encontrada.'));
        
        await expect(propriedadeService.excluirPropriedade(99)).rejects.toThrow('Propriedade não encontrada.');
    });
});