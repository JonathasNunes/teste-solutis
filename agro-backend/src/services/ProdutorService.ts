import { Injectable, Logger } from '@nestjs/common';
import { Produtor } from '../entities/Produtor';
import { ProdutorRepository } from '../repositories/ProdutorRepository';
import { ProdutorValidator } from '../validators/ProdutorValidator';
import { validateOrReject } from 'class-validator';

@Injectable()
export class ProdutorService {
  private readonly logger = new Logger(ProdutorService.name);

  constructor(private readonly produtorRepository: ProdutorRepository) {}

  async cadastrarProdutor(cpfCnpj: string, nome: string): Promise<Produtor> {
    this.logger.log(`Iniciando cadastro de produtor: ${nome} - CPF/CNPJ: ${cpfCnpj}`);

    const produtor = new ProdutorValidator();
    Object.assign(produtor, {nome, cpf_cnpj: cpfCnpj});
    await validateOrReject(produtor);

    if (!ProdutorValidator.validarCpfCnpj(cpfCnpj)) {
      this.logger.warn(`CPF ou CNPJ inválido: ${cpfCnpj}`);
      throw new Error('CPF ou CNPJ inválido.');
    }

    const produtorExistente = await this.produtorRepository.findByCpfCnpj(cpfCnpj);
    if (produtorExistente) {
      this.logger.warn(`Tentativa de cadastro duplicado para CPF/CNPJ: ${cpfCnpj}`);
      throw new Error('Já existe um produtor com este CPF/CNPJ.');
    }

    return this.produtorRepository.createProdutor({ cpf_cnpj: cpfCnpj, nome });
  }

  async atualizarProdutor(
    id: number,
    updateData: Partial<Produtor>
  ): Promise<Produtor> {
    this.logger.log(`Iniciando atualização do produtor ID: ${id}`);

    if (!ProdutorValidator.validarCpfCnpj(updateData.cpf_cnpj)) {
      this.logger.warn(`CPF ou CNPJ inválido ao atualizar produtor ID: ${id}`);
      throw new Error('CPF ou CNPJ inválido.');
    }

    return this.produtorRepository.updateProdutor(id, updateData);
  }

  async listarTodos(): Promise<Produtor[]> {
    this.logger.log('Listando todos os produtores');
    return this.produtorRepository.findAll();
  }

  async buscarPorId(id: number): Promise<Produtor | undefined> {
    this.logger.log(`Buscando produtor por ID: ${id}`);
    return this.produtorRepository.findById(id);
  }

  async excluirProdutor(id: number): Promise<void> {
    this.logger.log(`Excluindo produtor ID: ${id}`);
    await this.produtorRepository.deleteProdutor(id);
    this.logger.log(`Produtor excluído com sucesso: ID ${id}`);
  }
}
