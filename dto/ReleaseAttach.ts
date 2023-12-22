
export interface ReleaseAttach {
    id: number,
    dataCriacao: Date,
    nome: string,
    tamanho: number,
    tipoArquivo: string,
    caminhoS3: string,
    nomeArquivo: string,
    referencia: string;
}