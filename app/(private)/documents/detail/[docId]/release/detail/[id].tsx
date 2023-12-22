import { Linking, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthProvider';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { Loading } from '@/components/Loading';
import { Release } from '@/dto/Release.dto';
import { ReleaseAttach } from '@/dto/ReleaseAttach';
import { ReleaseUtils } from '@/utils/ReleaseUtils';
import { ToastUtils } from '@/utils/Toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ReleaseDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const [detailRelease, isReleaseLoading] = useRequest<Release>(HTTP_VERB.GET);
  const [release, setRelease] = useState<Release | null>(null);

  const local = useLocalSearchParams<any>();
  const docId = local.docId;
  const relId = local.id;

  const formatDate = (date: Date) => date ? moment(date!).format('L') : '';

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const handleDownload = async (attach: ReleaseAttach) => {
    if (true) {
      ToastUtils.show('info', 'Atenção', 'Ainda não é possível visualizar o anexo');
      return;
    }

    const url = ReleaseUtils.downloadUrl(docId, relId, attach.id);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      ToastUtils.show('error', 'Erro ao abrir anexo', 'Infelizmente não foi possível interpretar o tipo do arquivo');
    }
  };

  const updateRelease = () => detailRelease(null, null, `/documents/${docId}/release/${relId}/detail`)
    .then(release => setRelease(release))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao detalhar ocorrência', body.error);
      else ToastUtils.show('error', 'Erro ao detalhar ocorrência', 'Tente novamente mais tarde');
    });

  useEffect(() => {
    updateRelease();
  }, []);

  return (<>
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {isReleaseLoading && <Loading />}
        {!isReleaseLoading && !release && <Text>Falha ao carregar documento!</Text>}
        {!isReleaseLoading && release && <>
          <Text style={styles.title}>{ReleaseUtils.formatReference(release.documentoGeral.periodicidade, release.competenciaReferencia!)}</Text>
          {release?.descricao && <Text style={styles.subtitle}>{release?.descricao}</Text>}
          <View style={styles.box}>
            <Text style={styles.boxKey}>Situação</Text>
            <Text style={styles.boxValue}>{release.situacao}</Text>
          </View>
          {release.observacoes && release.observacoes.length > 0 && <>
            <Text style={styles.title}>Observações</Text>
            {release.observacoes.map(obs =>
              <View key={obs.id} style={styles.observacao}>
                <Text style={styles.observacaoSmallInfo}>{formatDate(obs.dataCriacao)} {obs.usuario.nome}</Text>
                <Text>{obs.observacao}</Text>
              </View>
            )}
          </>}
          {release.anexos && release.anexos.length > 0 && <>
            <Text style={styles.title}>Anexos</Text>
            {release.anexos.map(attach =>
              <TouchableOpacity key={attach.id} onPress={() => handleDownload(attach)}>
                <View style={styles.observacao}>
                  <Text style={styles.observacaoSmallInfo}>{formatDate(attach.dataCriacao)}</Text>
                  <Text>{attach.nomeArquivo}</Text>
                </View>
              </TouchableOpacity>
            )}
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
  observacao: {
    display: 'flex',
    gap: 8,
  },
  observacaoSmallInfo: {
    fontSize: 10
  }
});