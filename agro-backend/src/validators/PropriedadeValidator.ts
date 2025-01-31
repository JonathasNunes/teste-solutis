import { IsString, IsNotEmpty, IsDecimal, IsNumber } from 'class-validator';

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
    @IsNumber()
    area_total: number;

    @IsNotEmpty()
    @IsNumber()
    area_agricultavel: number;

    @IsNotEmpty()
    @IsNumber()
    area_vegetacao: number;

    static validarAreas(areaTotal: number, areaAgricultavel: number, areaVegetacao: number): boolean {
        return areaAgricultavel + areaVegetacao <= areaTotal;
    }
}