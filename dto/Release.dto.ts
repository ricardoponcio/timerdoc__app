import { Document } from "./Document.dto";
import { ReleaseAttach } from "./ReleaseAttach";

export interface Release {
    id: number,
    dataCriacao: Date,
    dataAtualizacao: Date,
    dataRemocao?: Date,
    prazo: Date,
    competenciaReferencia: Date,
    situacao: string;
    entrega: Date,
    descricao: string;
    anexos: ReleaseAttach[];
    observacoes: {
        id: number,
        dataCriacao: Date,
        observacao: string,
        usuario: {
            nome: string;
            email: string;
            telefone: string;
        },
    }[];
    documentoGeral: Document;
}