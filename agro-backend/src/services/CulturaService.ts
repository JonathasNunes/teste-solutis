import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from '../entities/Cultura';
import { CulturaRepository } from '../repositories/CulturaRepository';
import { validateOrReject } from 'class-validator';
import { CulturaValidator } from '../validators/CulturaValidator';

@Injectable()
export class CulturaService {
    constructor(
        @InjectRepository(CulturaRepository)
        private readonly culturaRepository: CulturaRepository
    ) {}

    async listarTodas(): Promise<Cultura[]> {
        return this.culturaRepository.find({ relations: ['propriedade'] });
    }

    async buscarPorId(id: number): Promise<Cultura | undefined> {
        return this.culturaRepository.findOne({
            where: { id },
            relations: ['propriedade'],
        });
    }

    async criar(culturaData: Partial<Cultura>): Promise<Cultura> {

        const cultura = new CulturaValidator();
        Object.assign(cultura, culturaData);
        await validateOrReject(cultura);

        if (!culturaData.propriedade || !culturaData.propriedade.id) {
            throw new Error('O ID da propriedade é obrigatório para cadastrar uma cultura.');
        }
        const novaCultura = this.culturaRepository.create(culturaData);
        return this.culturaRepository.save(novaCultura);
    }

    async alterar(id: number, culturaData: Partial<Cultura>): Promise<Cultura> {
        const culturaExistente = await this.buscarPorId(id);
        if (!culturaExistente) {
            throw new Error('Cultura não encontrada.');
        }
    
        Object.assign(culturaExistente, culturaData);
        return this.culturaRepository.save(culturaExistente);
    }

    async deletar(id: number): Promise<void> {
        await this.culturaRepository.delete(id);
    }
}
