import { Produtor } from "src/entities/Produtor";

export interface IProdutorRepository {
    findByCpfCnpj(cpfCnpj: string): Promise<Produtor | undefined>;
    createProdutor(produtor: Partial<Produtor>): Promise<Produtor>;
    updateProdutor(id: number, updateData: Partial<Produtor>): Promise<Produtor>;
    findAll(): Promise<Produtor[]>;
    findById(id: number): Promise<Produtor | undefined>;
    deleteProdutor(id: number): Promise<void>;
}  