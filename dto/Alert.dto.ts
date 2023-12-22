export interface Alert {
    id: number,
    dataHora: Date,
    mensagem: string,
    descricao: string,
    tipo: string,
    prioridade: string,
    prioridadeOrdem: number,
    resolucao: boolean,
    documentoGeral: {
        id: number,
        nome: string,
        descricao?: string,
        lancamento: Date,
        dataRemocao?: Date,
        recorrencia: number,
        periodicidade: string,
        inicioContagem: Date,
        fimContagem?: Date,
        valorPadrao: number,
        diasAvisoVencimento: number
    }
}