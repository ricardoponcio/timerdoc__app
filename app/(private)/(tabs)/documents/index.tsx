import { RefreshControl, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Portal } from '@/components/Portal';
import { View } from '@/components/Themed';
import { Document } from '@/dto/Document.dto';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';
import { ToastUtils } from '@/utils/Toast';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const router = useRouter();
  const [listDocuments, isListDocumentsLoading] = useRequest<Document[]>(HTTP_VERB.GET, '/documents/list');
  const [docs, setDocs] = useState<Document[]>([]);

  // const modalizeRef = useRef<Modalize | null>(null);
  // const onOpen = () => {
  //   modalizeRef.current?.open();
  // };

  useEffect(() => {
    updateDocuments();
  }, []);

  const updateDocuments = () => listDocuments(null)
    .then(docs => setDocs(docs))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar documentos', body.error);
      else ToastUtils.show('error', 'Erro ao listar documentos', 'Tente novamente mais tarde');
    });

  const hasEndDate = (item: Document) => !!item.fimContagem;

  const formatDate = (date: Date) => date ? moment(date!).format('L') : '';

  const getRecorrence = (item: Document) => item.recorrencia > 0 ? `${item.recorrencia}x ao ${item.periodicidade}` : 'Sem Recorrência'

  return (<>
    <View style={styles.container}>
      <Portal />
      <FlatList data={docs} style={styles.lista}
        ListEmptyComponent={() => <Text>Nenhum documento foi cadastrado ainda</Text>}
        refreshControl={<RefreshControl refreshing={isListDocumentsLoading} onRefresh={() => updateDocuments()} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/documents/detail/${item.id}`)}>
            <View style={styles.documentWrapper}>
              <Text style={styles.documentTitle}>{item.nome}</Text>
              <View style={styles.documentDetailWrapper}>
                <Text style={styles.documentDetails}>{formatDate(item.inicioContagem)} {hasEndDate(item) ? '-' : ''} {formatDate(item.fimContagem!)}</Text>
                <Text style={styles.documentDetails}>{getRecorrence(item)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )} />
    </View>
    {/*
    <Modalize ref={modalizeRef} 
      disableScrollIfPossible={false} 
      adjustToContentHeight={true}>
      <DocumentInfo />
    </Modalize> */}
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'flex-start',
    gap: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 8,
  },

  lista: {
    width: '100%'
  },
  documentWrapper: {
    flex: 1,
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'lightcoral'
  },
  documentDetailWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightcoral',
    justifyContent: 'space-between'
  },
  documentTitle: {
    fontWeight: '500',
    color: 'white'
  },
  documentDetails: {
    fontSize: 10,
    color: 'white'
  }
});
