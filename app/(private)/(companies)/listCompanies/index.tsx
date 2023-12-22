import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthProvider';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { AuthResponse } from '@/dto/AuthResponse.dto';
import { Company } from '@/dto/Company.dto';
import { ToastUtils } from '@/utils/Toast';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

export default function ListCompanies() {
  const router = useRouter();
  const { user, setCompany, logout } = useAuth();
  const [listCompanies, isListCompaniesLoading] = useRequest<Company[]>(HTTP_VERB.GET, '/company/list');
  const [selectCompany, isSelectCompanyLoading] = useRequest<AuthResponse>(HTTP_VERB.GET);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const updateCompanies = () => listCompanies(null)
    .then(companies => setCompanies(companies))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao listar documentos', body.error);
      else ToastUtils.show('error', 'Erro ao listar documentos', 'Tente novamente mais tarde');
    });

  useEffect(() => {
    updateCompanies();
  }, []);

  const getNewUserToken = (company: Company) => {
    setSelectedCompany(company);
    selectCompany(null, null, `/company/${company.empresa.id}/select`)
      .then(user => {
        setCompany(company, user)
      })
  }

  return (<>
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text>Escolha uma empresa para operar</Text>
        <FlatList data={companies}
          ListEmptyComponent={() => <Text>Nenhuma empresa encontrada</Text>}
          refreshControl={<RefreshControl refreshing={isListCompaniesLoading} onRefresh={() => updateCompanies()} />}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemGroup}>
                <Text style={styles.companyName}>{item.empresa.razaoSocial}</Text>
                <Text style={styles.roleName}>{item?.role?.nome}</Text>
              </View>
              <CustomButton key={item.empresa.id} iconName='arrow-right'
                isLoading={isSelectCompanyLoading && item.empresa.id === selectedCompany?.empresa?.id}
                disabled={isSelectCompanyLoading && item.empresa.id !== selectedCompany?.empresa?.id}
                onPress={() => getNewUserToken(item)} />
            </View>
          )}
        />
      </View>
      <View style={styles.options}>
        <CustomButton title='Nova Empresa' onPress={() => router.replace('newCompany')} />
        <CustomButton title='Sair' onPress={() => logout()} />
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
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemGroup: {
    flex: 1
  },
  companyName: {
    fontWeight: '500'
  },
  roleName: {
    fontSize: 10
  }
});