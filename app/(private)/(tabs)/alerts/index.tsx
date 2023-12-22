import { StyleSheet } from 'react-native';

import { Portal } from '@/components/Portal';
import { Text, View } from '@/components/Themed';
import { Alert } from '@/dto/Alert.dto';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';
import { ToastUtils } from '@/utils/Toast';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  const [listAlerts, isListAlertsLoading] = useRequest<Alert[]>(HTTP_VERB.GET, '/documents-alerts/list');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const updateAlerts = () => listAlerts(null)
    .then(alerts => setAlerts(alerts))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar avisos', body.error);
      else ToastUtils.show('error', 'Erro ao listar avisos', 'Tente novamente mais tarde');
    });

  useEffect(() => {
    updateAlerts();
  }, []);

  return (
    <View style={styles.container}>
      <Portal />
      <FlatList data={alerts} style={styles.lista}
        ListEmptyComponent={() => <Text>Nenhum aviso reportado</Text>}
        refreshControl={<RefreshControl refreshing={isListAlertsLoading} onRefresh={() => updateAlerts()} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.documentWrapper}>
            <Text style={styles.documentTitle}>{item?.mensagem}</Text>
            <Text style={styles.documentDetails}>{item?.descricao}</Text>
          </View>
        )} />
    </View>
  );
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
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap'
  },
  documentTitle: {
    fontWeight: '500',
    color: 'white'
  },
  documentDetails: {
    fontSize: 10,
    color: 'white',
  }
});
