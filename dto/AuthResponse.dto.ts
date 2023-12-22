export interface AuthResponse {
    access_token: string;
    type: string;
    user: {
        id: number,
        ativo: boolean,
        email: string,
        nome: string,
        telefone: string
    },
    companyData: {
        razaoSocial: string,
        id: number,
        cnpj: string,
        fantasia: string
    }
}