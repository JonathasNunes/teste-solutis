import { Propriedade } from "src/entities/Propriedade";

export interface IPropriedadeRepository {
    findByProdutor(produtorId: number): Promise<Propriedade[]>;
    createPropriedade(propriedadeData: Partial<Propriedade>): Promise<Propriedade>;
    updatePropriedade(id: number, updateData: Partial<Propriedade>): Promise<Propriedade>;
    findAll(): Promise<Propriedade[]>;
    findById(id: number): Promise<Propriedade | undefined>;
    deletePropriedade(id: number): Promise<void>;
}