import { InjectRepository } from '@nestjs/typeorm';
import { Produtor } from '../entities/Produtor';
import { ProdutorRepository } from '../repositories/ProdutorRepository';
import { ProdutorValidator } from '../validators/ProdutorValidator';
import { validateOrReject } from 'class-validator';

export class ProdutorService {
  constructor(
    @InjectRepository(ProdutorRepository)
    private readonly produtorRepository: ProdutorRepository
  ) {}

  async cadastrarProdutor(cpfCnpj: string, nome: string): Promise<Produtor> {
    
    const produtor = new ProdutorValidator();
    Object.assign(produtor, {nome, cpf_cnpj: cpfCnpj});
    await validateOrReject(produtor);

    if (!ProdutorValidator.validarCpfCnpj(cpfCnpj)) {
      throw new Error('CPF ou CNPJ inválido.');
    }

    const produtorExistente = await this.produtorRepository.findByCpfCnpj(cpfCnpj);
    if (produtorExistente) {
      throw new Error('Já existe um produtor com este CPF/CNPJ.');
    }

    return this.produtorRepository.createProdutor({ cpf_cnpj: cpfCnpj, nome });
  }

  async atualizarProdutor(
    id: number,
    updateData: Partial<Produtor>
  ): Promise<Produtor> {

    if (!ProdutorValidator.validarCpfCnpj(updateData.cpf_cnpj)) {
      throw new Error('CPF ou CNPJ inválido.');
    }

    return this.produtorRepository.updateProdutor(id, updateData);
  }

  async listarTodos(): Promise<Produtor[]> {
    return this.produtorRepository.findAll();
  }

  async buscarPorId(id: number): Promise<Produtor | undefined> {
    return this.produtorRepository.findById(id);
  }

  async excluirProdutor(id: number): Promise<void> {
    await this.produtorRepository.deleteProdutor(id);
  }
}
