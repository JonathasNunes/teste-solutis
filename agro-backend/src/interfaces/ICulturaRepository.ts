import { Cultura } from "src/entities/Cultura";
import { Propriedade } from "src/entities/Propriedade";

export interface ICulturaRepository {
    findByPropriedade(propriedadeId: number): Promise<Cultura[]> ;
    createCultura(propriedade: Propriedade, nome: string, safra: string) 
}  