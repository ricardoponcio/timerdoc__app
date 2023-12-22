import moment from "moment";
import { BackendUtils } from "./BackendUtils";

export class ReleaseUtils {

    static formatReference = (periodicidade: string, competencia: Date) => {
        const competenciaMoment = moment(competencia);
        competenciaMoment.locale('pt-BR')
        switch (periodicidade) {
            case "DIA":
            case "SEMANA":
                return competenciaMoment.format('L');
            case "MES":
            case "TRIMESTRE":
            case "SEMESTRE":
                return competenciaMoment.format('MMMM/yyyy');
            case "ANO":
                return competenciaMoment.format('yyyy');
            default: return competencia.toISOString();
        }
    };

    static downloadUrl(docId: number | string, relId: number | string, attachId: number | string) {
        return `${BackendUtils.BaseURL}/documents/${docId}/release/${relId}/download/${attachId}`;
    }

}