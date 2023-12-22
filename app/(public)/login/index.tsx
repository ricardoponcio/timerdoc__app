import { Image, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { useAuth } from '@/context/AuthProvider';
import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { Formik } from 'formik';

import { AuthResponse } from '@/dto/AuthResponse.dto';
import { ToastUtils } from '@/utils/Toast';
import { useEffect } from 'react';
import { router, useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const [doLogin, isLoginLoading] = useRequest<AuthResponse>(HTTP_VERB.POST, '/auth/login');

  useEffect(() => logout(), []);

  const submit = (email: string, password: string) => {
    doLogin({ email, password })
      .then(login)
      .catch(e => ToastUtils.show('error', 'Erro ao Logar', 'Credenciais inválidas'));
  }

  return (
    <Formik
      initialValues={{ email: 'timerdoc_user_2@gmail.com', password: 't1m3rd0c@2022' }}
      onSubmit={values => submit(values.email, values.password)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.login}>
          <Image resizeMode='contain' style={styles.logo}
            source={require('@/assets/images/TD-FULL-V1-FIT-WO-BG.png')} />
          <CustomInput
            placeholder="E-mail"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          <CustomInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
          />
          <CustomButton title="Entrar" isLoading={isLoginLoading} onPress={() => { handleSubmit() }} />
          <CustomButton title="Cadastrar-se" onPress={() => { router.replace('/register') }} />
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
