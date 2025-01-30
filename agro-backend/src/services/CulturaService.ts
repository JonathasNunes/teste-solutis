import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from '../entities/Cultura.js';
import { CulturaRepository } from '../repositories/CulturaRepository.js';
import { validateOrReject } from 'class-validator';
import { CulturaValidator } from '../validators/CulturaValidator.js';

@Injectable()
export class CulturaService {
    private readonly logger = new Logger(CulturaService.name);

    constructor(
        @InjectRepository(CulturaRepository)
        private readonly culturaRepository: CulturaRepository
    ) {}

    async listarTodas(): Promise<Cultura[]> {
        this.logger.log('Listando todas as culturas');
        return this.culturaRepository.find({ relations: ['propriedade'] });
    }

    async buscarPorId(id: number): Promise<Cultura | undefined> {
        this.logger.log(`Buscando cultura por ID: ${id}`);
        const cultura = await this.culturaRepository.findOne({
            where: { id },
            relations: ['propriedade'],
        });

        if (!cultura) {
            this.logger.warn(`Cultura não encontrada: ID ${id}`);
        }

        return cultura;
    }

    async criar(culturaData: Partial<Cultura>): Promise<Cultura> {
        this.logger.log(`Iniciando criação de cultura: ${culturaData.nome}`);

        const cultura = new CulturaValidator();
        Object.assign(cultura, culturaData);

        try {
            await validateOrReject(cultura);
        } catch (error) {
            this.logger.warn(`Dados inválidos ao cadastrar cultura: ${JSON.stringify(culturaData)}`);
            throw error;
        }

        if (!culturaData.propriedade || !culturaData.propriedade.id) {
            this.logger.warn('Tentativa de cadastro de cultura sem propriedade vinculada');
            throw new Error('O ID da propriedade é obrigatório para cadastrar uma cultura.');
        }

        const novaCultura = this.culturaRepository.create(culturaData);
        const culturaCriada = await this.culturaRepository.save(novaCultura);

        this.logger.log(`Cultura criada com sucesso: ID ${culturaCriada.id}`);
        return culturaCriada;
    }

    async alterar(id: number, culturaData: Partial<Cultura>): Promise<Cultura> {
        this.logger.log(`Iniciando atualização da cultura ID: ${id}`);

        const culturaExistente = await this.buscarPorId(id);
        if (!culturaExistente) {
            this.logger.warn(`Tentativa de atualização de cultura inexistente: ID ${id}`);
            throw new Error('Cultura não encontrada.');
        }

        Object.assign(culturaExistente, culturaData);
        const culturaAtualizada = await this.culturaRepository.save(culturaExistente);

        this.logger.log(`Cultura atualizada com sucesso: ID ${id}`);
        return culturaAtualizada;
    }

    async deletar(id: number): Promise<void> {
        this.logger.log(`Iniciando exclusão da cultura ID: ${id}`);
        await this.culturaRepository.delete(id);
        this.logger.log(`Cultura excluída com sucesso: ID ${id}`);
    }
}