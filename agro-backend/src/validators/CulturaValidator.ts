import { IsString, IsNotEmpty } from 'class-validator';

export class CulturaValidator {
    
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    safra: string;

    @IsNotEmpty()
    propriedade_id: number;
}
