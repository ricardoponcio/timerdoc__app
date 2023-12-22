import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthProvider';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { Loading } from '@/components/Loading';
import { Document } from '@/dto/Document.dto';
import { Release } from '@/dto/Release.dto';
import { ReleaseUtils } from '@/utils/ReleaseUtils';
import { ToastUtils } from '@/utils/Toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function DocumentDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const [detailDoc, isDetailDocLoading] = useRequest<Document>(HTTP_VERB.GET);
  const [document, setDocument] = useState<Document | null>(null);
  const [listReleases, isListReleasesLoading] = useRequest<Release[]>(HTTP_VERB.GET);
  const [releases, setReleases] = useState<Release[]>([]);

  const local = useLocalSearchParams<any>();
  const docId = local.id;

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const updateDocument = () => detailDoc(null, null, `/documents/${docId}/detail`)
    .then(document => setDocument(document))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao detalhar documento', body.error);
      else ToastUtils.show('error', 'Erro ao detalhar documento', 'Tente novamente mais tarde');
    });

  useEffect(() => {
    updateDocument();
  }, []);

  useEffect(() => {
    listReleases(undefined, undefined, `/documents/${docId}/release/list`)
      .then(releases => setReleases(releases))
      .catch(e => {
        const body = e.response?.data;
        if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar ocorrências', body.error);
        else ToastUtils.show('error', 'Erro ao listar ocorrências', 'Tente novamente mais tarde');
      });
  }, [document]);

  const hasEndDate = (item: Document) => !!item.fimContagem;

  const formatDate = (date: Date) => date ? moment(date!).format('L') : '';

  const getRecorrence = (item?: Document) => item != null ? item.recorrencia > 0 ? `${item.recorrencia}x ao ${item.periodicidade}` : 'Sem Recorrência' : null;

  return (<>
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {isDetailDocLoading && <Loading />}
        {!isDetailDocLoading && !document && <Text>Falha ao carregar documento!</Text>}
        {!isDetailDocLoading && document && <>
          <Text style={styles.title}>{document?.nome}</Text>
          {document?.descricao && <Text style={styles.subtitle}>{document?.descricao}</Text>}
          <View style={styles.separator} />
          <View style={styles.box}>
            <Text style={styles.boxKey}>Ocorrência</Text>
            <Text style={styles.boxValue}>{getRecorrence(document!)}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxKey}>Início</Text>
            <Text style={styles.boxValue}>{formatDate(document!.inicioContagem)}</Text>
          </View>
          {document!.fimContagem &&
            <View style={styles.box}>
              <Text style={styles.boxKey}>Fim</Text>
              <Text style={styles.boxValue}>{formatDate(document!.fimContagem!)}</Text>
            </View>
          }
          <View style={styles.box}>
            <Text style={styles.boxKey}>Valor</Text>
            <Text style={styles.boxValue}>{formatter.format(document!.valorPadrao)}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxKey}>Criado em:</Text>
            <Text style={styles.boxValue}>{formatDate(document!.lancamento)}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxKey}>Criado por:</Text>
            <Text style={styles.boxValue}>{document!.usuario.nome}</Text>
          </View>
          {isListReleasesLoading && <Loading />}
          {!isListReleasesLoading && (!releases || releases.length === 0) && <Text>Nenhuma ocorrência cadastrada!</Text>}
          {!isListReleasesLoading && releases && releases.length > 0 && <>
            <Text style={styles.title}>Ocorrências</Text>
            <View style={styles.references}>
              {releases.map(r =>
                <TouchableOpacity key={r.id} onPress={() => router.push(`/documents/detail/${document.id}/release/detail/${r.id}`)}>
                  <View style={styles.reference}>
                    <Text>{ReleaseUtils.formatReference(document.periodicidade, r.competenciaReferencia!)}</Text>
                    <View style={styles.box}>
                      <Text style={styles.boxKey}>Situação</Text>
                      <Text style={styles.boxValue}>{r.situacao}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </>}
        </>}
      </View>
      <View style={styles.options}>
        <CustomButton title='Voltar' onPress={() => router.back()} />
      </View>
    </View>
  </>);
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
    paddingTop: 60,
    flex: 1,
    gap: 8,
  },
  container: {
    flex: 1,
    gap: 16,
  },
  options: {
    display: 'flex',
    gap: 8,
  },
  separator: {
    height: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '500'
  },
  subtitle: {
    fontSize: 14
  },
  box: {
    display: 'flex',
    flexDirection: 'row'
  },
  boxKey: {
    width: '25%',
    fontWeight: '500'
  },
  boxValue: {
    flexWrap: 'wrap'
  },
  references: {
    display: 'flex',
    gap: 8,
  },
  reference: {
    display: 'flex',
    gap: 8,
    padding: 8,
    borderColor: 'black',
    borderWidth: 1
  }
});