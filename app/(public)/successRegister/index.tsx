import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { CustomButton } from '@/components/CustomButton';
import { useRouter } from 'expo-router';

export default function SuccessRegister() {
  const router = useRouter();

  return (<>
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Parabéns, seu registro foi concluído com sucesso!</Text>
        <Text style={styles.subTitle}>Acesse seu email e clique no link enviado para concluir o cadastro e começar a utilizar o sistema</Text>
      </View>
      <CustomButton title="Fazer Login" onPress={() => { router.replace('/login') }} />
    </View>
  </>);
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 32
  },
  container: {
    gap: 8,
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    color: 'green',
    fontWeight: '500',
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 12,
    textAlign: 'justify'
  }
});
