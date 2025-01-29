import { cpf, cnpj } from 'cpf-cnpj-validator';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProdutorValidator {

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    cpf_cnpj: string;

    static validarCpfCnpj(cpfCnpj: string): boolean {
        const cleaned = cpfCnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cleaned.length === 11) {
            return cpf.isValid(cleaned); 
        } else if (cleaned.length === 14) {
            return cnpj.isValid(cleaned); 
        }
        return false;
    }
}
