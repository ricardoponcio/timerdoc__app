import { Loading } from '@/components/Loading';
import { useAuth } from '@/context/AuthProvider';
import { useWaitNavigation } from '@/hook/useWaitNavigation';
import { StorageUtils } from '@/utils/Storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function InitialRoute() {
  const router = useRouter();
  const { user, companySelected, loadedStorage, doSecuredRoute, applyStorage } = useAuth();
  const [isNavigationReady, rootNavigation] = useWaitNavigation();
  const [didTheRouter, setDidTheRouter] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const storageUser = await StorageUtils.retrieveData('user');
      const storageCompany = await StorageUtils.retrieveData('company');
      applyStorage(JSON.parse(storageUser!), JSON.parse(storageCompany!));
    })();
  }, []);

  useEffect(() => {
    if (isNavigationReady && loadedStorage && !didTheRouter) {
      doSecuredRoute();
      setDidTheRouter(true);
    }
  }, [isNavigationReady, loadedStorage]);

  return (<View style={styles.wrapper}><Loading /></View>)
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
