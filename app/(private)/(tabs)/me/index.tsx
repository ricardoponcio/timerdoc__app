import { StyleSheet } from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'expo-router';

export default function MinhaConta() {
  const { user, companySelected, logout, askChangeCompany } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.grupo}>
        <Text style={styles.title}>Nome</Text>
        <CustomInput value={user?.user?.nome} editable={false} />
      </View>
      <View style={styles.grupo}>
        <Text style={styles.title}>Email</Text>
        <CustomInput value={user?.user?.email} editable={false} />
      </View>
      <View style={styles.grupo}>
        <Text style={styles.title}>Empresa Selecionada</Text>
        <CustomInput value={companySelected?.empresa?.razaoSocial} editable={false} />
      </View>
      <View style={styles.grupo}>
        <Text style={styles.title}>Pefil Aplicado</Text>
        <CustomInput value={companySelected?.role?.nome} editable={false} />
        <CustomButton title='Trocar Empresa' onPress={() => askChangeCompany()} />
      </View>
      <CustomButton title='Sair' onPress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 0,
    gap: 8
  },
  grupo: {
    display: 'flex',
    gap: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
