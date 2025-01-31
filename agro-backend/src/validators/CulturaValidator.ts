import { IsString, IsNotEmpty } from 'class-validator';
import { Propriedade } from '../entities/Propriedade';

export class CulturaValidator {
    
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    safra: string;

    @IsNotEmpty()
    propriedade: Propriedade;
}
