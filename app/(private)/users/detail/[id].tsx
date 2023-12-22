import { StyleSheet, Text, View } from 'react-native';

import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { Loading } from '@/components/Loading';
import { Role } from '@/dto/Role.dto';
import { User } from '@/dto/User.dto';
import { ToastUtils } from '@/utils/Toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function UserDetail() {
  const router = useRouter();
  const [listRoles, isListRolesLoading] = useRequest<Role[]>(HTTP_VERB.GET, '/roles/list');
  const [roles, setRoles] = useState<Role[]>([]);
  const [listUsers, isListUsersLoading] = useRequest<User[]>(HTTP_VERB.GET, '/users/list');
  const [user, setUser] = useState<User | null>(null);
  const [updateUser, isUpdateUserLoading] = useRequest<void>(HTTP_VERB.PATCH);

  const local = useLocalSearchParams<any>();
  const userId = local.id;

  const formatDate = (date: Date) => date ? moment(date!).format('L') : '';

  const updateRoles = () => listRoles(null)
    .then(roles => setRoles(roles))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar perfis', body.error);
      else ToastUtils.show('error', 'Erro ao listar perfis', 'Tente novamente mais tarde');
    });

  const updateUserState = () => listUsers(null)
    .then(users => setUser(users.filter(u => u.usuario.id === +userId)[0]))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar perfis', body.error);
      else ToastUtils.show('error', 'Erro ao listar perfis', 'Tente novamente mais tarde');
    });

  useEffect(() => {
    updateRoles();
    updateUserState();
  }, []);

  const updateRole = async (role: Role) => {
    await updateUser({
      roleName: role.nome
    }, undefined, `/users/${userId}/update`)
      .then(data => router.back())
      .catch(e => {
        const body = e.response?.data;
        if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao atualizar usuário', body.error);
        else ToastUtils.show('error', 'Erro ao atualizar usuário', 'Tente novamente mais tarde');
      });
  }

  return (<>
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {isListUsersLoading && <Loading />}
        {!isListUsersLoading && !user && <Text>Falha ao carregar usuário!</Text>}
        {!isListUsersLoading && user && <>
          <Text style={styles.title}>{user.usuario.nome}</Text>
          {roles?.map((r, idx) => <>
            <TouchableOpacity key={idx} onPress={() => updateRole(r)}>
              <View key={idx}>
                <Text style={user.role.nome === r.nome ? styles.selecionado : {}}>{r.nome}</Text>
              </View>
            </TouchableOpacity>
          </>)}
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
  observacao: {
    display: 'flex',
    gap: 8,
  },
  observacaoSmallInfo: {
    fontSize: 10
  },
  selecionado: {
    fontWeight: '500'
  }
});