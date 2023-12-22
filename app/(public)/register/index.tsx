import { Image, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { Formik } from 'formik';

import { useRouter } from 'expo-router';
import { ToastUtils } from '@/utils/Toast';

export default function Register() {
  const router = useRouter();
  const [doRegister, isRegisterLoading] = useRequest(HTTP_VERB.POST, '/auth/register');

  const submit = (nome: string, email: string, telefone: string) => {
    doRegister({
      nome, email, telefone
    }).then(data => router.replace('/successRegister'))
    .catch(e => {
      const body = e.response?.data;
      if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao Registrar-se', body.error);
      else ToastUtils.show('error', 'Erro ao Registrar-se', 'Tente novamente mais tarde');
    });
  }

  return (
    <Formik
      initialValues={{ nome: 'Ricardo Poncio', email: 'timerdoc_user_3@gmail.com', telefone: '' }}
      onSubmit={values => submit(values.nome, values.email, values.telefone)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.login}>
          <Image resizeMode='contain' style={styles.logo}
            source={require('@/assets/images/TD-FULL-V1-FIT-WO-BG.png')} />
          <CustomInput
            placeholder="Nome"
            onChangeText={handleChange('nome')}
            onBlur={handleBlur('nome')}
            value={values.nome}
          />
          <CustomInput
            placeholder="E-mail"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          <CustomInput
            placeholder="Telefone"
            onChangeText={handleChange('telefone')}
            onBlur={handleBlur('telefone')}
            value={values.telefone}
          />
          <CustomButton title="Registrar" isLoading={isRegisterLoading} onPress={() => { handleSubmit() }} />
          <CustomButton title="Fazer Login" onPress={() => { router.replace('/login') }} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  title: {

  },
  login: {
    justifyContent: "center",
    flex: 1,
    padding: 24,
    gap: 8
  },
  logo: {
    maxWidth: '100%',
    height: 60,
    marginBottom: 16
  },
  emailInput: {

  },
  password: {

  }
});
