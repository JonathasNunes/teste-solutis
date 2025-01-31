import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Produtor } from '../entities/Produtor';
import { ProdutorRepository } from '../repositories/ProdutorRepository';
import { ProdutorValidator } from '../validators/ProdutorValidator';
import { validateOrReject } from 'class-validator';

@Injectable()
export class ProdutorService {
  private readonly logger = new Logger(ProdutorService.name);

  constructor(private readonly produtorRepository: ProdutorRepository) {}

  async cadastrarProdutor(cpf_cnpj: string, nome: string): Promise<Produtor> {
    this.logger.log(`Iniciando cadastro de produtor: ${nome} - CPF/CNPJ: ${cpf_cnpj}`);

    const produtor = new ProdutorValidator();
    Object.assign(produtor, {nome, cpf_cnpj});
    try {
      await validateOrReject(produtor);
    } catch (errors) {
      this.logger.warn(`Erro de validação ao cadastrar produtor: ${JSON.stringify(errors)}`);
      throw new BadRequestException(errors);
    }

    if (!ProdutorValidator.validarCpfCnpj(cpf_cnpj)) {
      this.logger.warn(`CPF ou CNPJ inválido: ${cpf_cnpj}`);
      throw new BadRequestException('CPF ou CNPJ inválido.');
    }

    const produtorExistente = await this.produtorRepository.findByCpfCnpj(cpf_cnpj);
    if (produtorExistente) {
      this.logger.warn(`Tentativa de cadastro duplicado para CPF/CNPJ: ${cpf_cnpj}`);
      throw new BadRequestException('Já existe um produtor com este CPF/CNPJ.');
    }

    return this.produtorRepository.createProdutor({ cpf_cnpj, nome });
  }

  async atualizarProdutor(
    id: number,
    updateData: Partial<Produtor>
  ): Promise<Produtor> {
    this.logger.log(`Iniciando atualização do produtor ID: ${id}`);

    if (!ProdutorValidator.validarCpfCnpj(updateData.cpf_cnpj)) {
      this.logger.warn(`CPF ou CNPJ inválido ao atualizar produtor ID: ${id}`);
      throw new BadRequestException('CPF ou CNPJ inválido.');
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
