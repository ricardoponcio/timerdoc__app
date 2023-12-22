export interface User {
    dataRemocao?: Date,
    usuario: {
        id: number,
        nome: string,
        email: string,
        telefone: string
    },
    role: {
        nome: string,
        ordem: number
    }
}