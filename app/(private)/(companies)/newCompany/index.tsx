import { StyleSheet, Text, View } from 'react-native';

import { HTTP_VERB, useRequest } from '@/hook/useRequest';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { Company } from '@/dto/Company.dto';
import { ToastUtils } from '@/utils/Toast';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';

export default function ListCompanies() {
  const router = useRouter();
  const [doNewCompany, isNewCompanyLoading] = useRequest<Company>(HTTP_VERB.POST, '/company/new');

  const submit = (cnpj: string, razaoSocial: string, fantasia: string) => {
    doNewCompany({
      cnpj, razaoSocial, fantasia
    }).then(data => router.replace('listCompanies'))
      .catch(e => {
        const body = e.response?.data;
        if (body && body.type === "BSS") ToastUtils.show('error', 'Erro ao Registrar empresa', body.error);
        else ToastUtils.show('error', 'Erro ao Registrar empresa', 'Tente novamente mais tarde');
      });
  }

  return (<>
    <Formik
      initialValues={{ cnpj: '00000000000000', razaoSocial: 'Razao Social', fantasia: 'Nome Fantasia' }}
      onSubmit={values => submit(values.cnpj, values.razaoSocial, values.fantasia)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.wrapper}>
          <Text style={styles.title}>Nova Empresa</Text>
          <View style={styles.container}>
            <CustomInput
              placeholder="CNPJ"
              onChangeText={handleChange('cnpj')}
              onBlur={handleBlur('cnpj')}
              value={values.cnpj}
            />
            <CustomInput
              placeholder="Razão Social"
              onChangeText={handleChange('razaoSocial')}
              onBlur={handleBlur('razaoSocial')}
              value={values.razaoSocial}
            />
            <CustomInput
              placeholder="Nome Fantasia"
              onChangeText={handleChange('fantasia')}
              onBlur={handleBlur('fantasia')}
              value={values.fantasia}
            />
          </View>
          <View style={styles.options}>
            <CustomButton title='Salvar' isLoading={isNewCompanyLoading} onPress={() => handleSubmit()} />
            <CustomButton title='Cancelar' onPress={() => router.replace('listCompanies')} />
          </View>
        </View>
      )}
    </Formik>
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
    fontWeight: '500'
  }
});