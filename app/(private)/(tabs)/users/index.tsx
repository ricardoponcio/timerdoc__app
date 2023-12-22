import { StyleSheet } from 'react-native';

import { Portal } from '@/components/Portal';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthProvider';
import { User } from '@/dto/User.dto';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';
import { ToastUtils } from '@/utils/Toast';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

export default function TabTwoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [listUsers, isListUsersLoading] = useRequest<User[]>(HTTP_VERB.GET, '/users/list');
  const [users, setUsers] = useState<User[]>([]);

  const updateUsers = () => listUsers(null)
    .then(users => setUsers(users))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar usuários', body.error);
      else ToastUtils.show('error', 'Erro ao listar usuários', 'Tente novamente mais tarde');
    });

  useEffect(() => {
    updateUsers();
  }, []);

  const itsMeData = (userList: User) => {
    return userList.usuario.id === user?.user.id ? ' (It\'s me!)' : '';
  }

  return (
    <View style={styles.container}>
      <Portal />
      <FlatList data={users} style={styles.lista}
        ListEmptyComponent={() => <Text>Nenhum usuário cadastrado nesta empresa</Text>}
        refreshControl={<RefreshControl refreshing={isListUsersLoading} onRefresh={() => updateUsers()} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.usuario.id} onPress={() => router.push(`/users/detail/${item.usuario.id}`)}>
            <View style={styles.documentWrapper}>
              <Text style={styles.documentTitle}>{item?.usuario?.nome}{itsMeData(item)}</Text>
              <View style={styles.documentDetailWrapper}>
                <Text style={styles.documentDetails}>{item?.usuario?.email}</Text>
                <Text style={styles.documentDetails}>{item?.role?.nome}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
