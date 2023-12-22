import { useAuth } from '@/context/AuthProvider';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from './CustomButton';
import { useRouter } from 'expo-router';

export function Portal() {
  const { user, companySelected, askChangeCompany } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.portal}>
      <View style={styles.info}>
        <Text style={[styles.title, styles.text]}>Olá {user?.user?.nome}</Text>
        <Text style={[styles.subtitle, styles.text]}>{companySelected?.empresa?.razaoSocial} - {companySelected?.role?.nome}</Text>
      </View>
      <CustomButton iconName='refresh' transparent={true} onPress={() => askChangeCompany()} />
    </View>
  );
}

const styles = StyleSheet.create({
  portal: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'coral',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  info: {
    display: 'flex',
    flexDirection: 'column'
  },
  text: {
    color: 'white',
  },
  title: {
    fontWeight: '500'
  },
  subtitle: {
    fontSize: 10
  }
});
