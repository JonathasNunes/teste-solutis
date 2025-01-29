import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class PropriedadeValidator {

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    cidade: string;

    @IsNotEmpty()
    @IsString()
    estado: string;

    @IsNotEmpty()
    @IsDecimal()
    area_total: number;

    @IsNotEmpty()
    @IsDecimal()
    area_agricultavel: number;

    @IsNotEmpty()
    @IsDecimal()
    area_vegetacao: number;

    static validarAreas(areaTotal: number, areaAgricultavel: number, areaVegetacao: number): boolean {
        return areaAgricultavel + areaVegetacao <= areaTotal;
    }
}