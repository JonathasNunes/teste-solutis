import { ProdutorService } from '../services/ProdutorService';
import { ProdutorRepository } from '../repositories/ProdutorRepository';
import { ProdutorValidator } from '../validators/ProdutorValidator';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProdutorService', () => {

    let produtorService: ProdutorService;
    let produtorRepository: ProdutorRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            ProdutorService,
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

        produtorService = module.get<ProdutorService>(ProdutorService);
        produtorRepository = module.get<ProdutorRepository>(getRepositoryToken(ProdutorRepository)); // Obtendo o repositório mockado
    });

    it('deve cadastrar um produtor com sucesso', async () => {
        const cpfCnpj = '07686526003';
        const nome = 'Produtor Teste';
    
        const produtorMock = { id: 1, cpf_cnpj: cpfCnpj, nome };
    
        // Garantir que a validação não falhe
        ProdutorValidator.validarCpfCnpj = jest.fn().mockReturnValue(true); // Mock da validação para sempre passar
    
        produtorRepository.findByCpfCnpj = jest.fn().mockResolvedValue(null); // Garantindo que o produtor não existe
        produtorRepository.createProdutor = jest.fn().mockResolvedValue(produtorMock);
    
        const result = await produtorService.cadastrarProdutor(cpfCnpj, nome);
    
        expect(result).toEqual(produtorMock);
        expect(produtorRepository.findByCpfCnpj).toHaveBeenCalledWith(cpfCnpj);
        expect(produtorRepository.createProdutor).toHaveBeenCalledWith({ cpf_cnpj: cpfCnpj, nome });
    });
  

    it('deve lançar erro se o CPF ou CNPJ for inválido', async () => {
        const cpfCnpj = '12345678';
        const nome = 'Produtor Teste';

        ProdutorValidator.validarCpfCnpj = jest.fn().mockReturnValue(false); // CPF/CNPJ inválido

        // Teste de erro, aguardando a mensagem correta
        await expect(produtorService.cadastrarProdutor(cpfCnpj, nome)).rejects.toThrow('CPF ou CNPJ inválido.');
    });


    it('deve lançar erro se o produtor já existir', async () => {
        const cpfCnpj = '12345678901'; // CPF válido
        const nome = 'Produtor Teste';
    
        // Simulando um produtor já existente
        const produtorExistente = { id: 1, cpf_cnpj: cpfCnpj, nome };
        produtorRepository.findByCpfCnpj = jest.fn().mockResolvedValue(produtorExistente); // Produtor existente
    
        // Mockando a validação do CPF para garantir que o CPF não seja invalidado
        ProdutorValidator.validarCpfCnpj = jest.fn().mockReturnValue(true); // Simula que o CPF é válido
    
        // Agora o erro esperado é o de produtor já existente
        await expect(produtorService.cadastrarProdutor(cpfCnpj, nome)).rejects.toThrow('Já existe um produtor com este CPF/CNPJ.');
    });
  
    it('deve atualizar o produtor com sucesso', async () => {
        const id = 1;
        const updateData = { nome: 'Novo Nome' };
        const produtorAtualizado = { id, nome: 'Novo Nome', cpf_cnpj: '12345678901' };
    
        produtorRepository.updateProdutor = jest.fn().mockResolvedValue(produtorAtualizado);
    
        const result = await produtorService.atualizarProdutor(id, updateData);
    
        expect(result).toEqual(produtorAtualizado);
        expect(produtorRepository.updateProdutor).toHaveBeenCalledWith(id, updateData);
    });
    
    it('deve lançar erro se o CPF ou CNPJ no update for inválido', async () => {
        const id = 1;
        const updateData = { cpf_cnpj: '12345678' };
    
        ProdutorValidator.validarCpfCnpj = jest.fn().mockReturnValue(false); // CPF/CNPJ inválido
    
        await expect(produtorService.atualizarProdutor(id, updateData)).rejects.toThrow('CPF ou CNPJ inválido.');
    });
  
    it('deve lançar erro se o produtor não for encontrado ao atualizar', async () => {
        const id = 1;
        const updateData = { nome: 'Novo Nome' };
    
        // Mockando a validação do CPF para garantir que o CPF seja considerado válido
        ProdutorValidator.validarCpfCnpj = jest.fn().mockReturnValue(true); // Simula que o CPF é válido
    
        // Simulando o erro de produtor não encontrado
        produtorRepository.updateProdutor = jest.fn().mockRejectedValue(new Error('Produtor não encontrado.'));
        
        // Espera-se que o erro "Produtor não encontrado." seja lançado
        await expect(produtorService.atualizarProdutor(id, updateData)).rejects.toThrow('Produtor não encontrado.');
    });
    
    it('deve listar todos os produtores', async () => {
        const produtoresMock = [
        { id: 1, nome: 'Produtor 1', cpf_cnpj: '12345678901' },
        { id: 2, nome: 'Produtor 2', cpf_cnpj: '98765432100' }
        ];
    
        produtorRepository.findAll = jest.fn().mockResolvedValue(produtoresMock);
    
        const result = await produtorService.listarTodos();
    
        expect(result).toEqual(produtoresMock);
        expect(produtorRepository.findAll).toHaveBeenCalled();
    });
  
    it('deve retornar um produtor pelo id', async () => {
        const produtorMock = { id: 1, nome: 'Produtor Teste', cpf_cnpj: '12345678901' };
    
        produtorRepository.findById = jest.fn().mockResolvedValue(produtorMock);
    
        const result = await produtorService.buscarPorId(1);
    
        expect(result).toEqual(produtorMock);
        expect(produtorRepository.findById).toHaveBeenCalledWith(1);
    });
    
    it('deve retornar undefined se não encontrar o produtor pelo id', async () => {
        produtorRepository.findById = jest.fn().mockResolvedValue(undefined);
    
        const result = await produtorService.buscarPorId(999);
    
        expect(result).toBeUndefined();
    });
        
    it('deve excluir o produtor com sucesso', async () => {
        const id = 1;
    
        produtorRepository.deleteProdutor = jest.fn().mockResolvedValue(undefined);
    
        await expect(produtorService.excluirProdutor(id)).resolves.not.toThrow();
        expect(produtorRepository.deleteProdutor).toHaveBeenCalledWith(id);
    });
  
    it('deve lançar erro se o produtor não for encontrado ao excluir', async () => {
        const id = 999;
    
        produtorRepository.deleteProdutor = jest.fn().mockRejectedValue(new Error('Produtor não encontrado.'));
    
        await expect(produtorService.excluirProdutor(id)).rejects.toThrow('Produtor não encontrado.');
    }); 
});
