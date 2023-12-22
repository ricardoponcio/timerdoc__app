import { AuthResponse } from "@/dto/AuthResponse.dto";
import { Company } from "@/dto/Company.dto";
import { useWaitNavigation } from "@/hook/useWaitNavigation";
import { StorageUtils } from "@/utils/Storage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type AuthType = {
  user: AuthResponse | null;
  companySelected: Company | null;
  loadedStorage: boolean;
  login: (user: AuthResponse) => void;
  logout: () => void;
  isLogged: () => boolean;
  setCompany: (company: Company, user: AuthResponse) => void;
  isCompanySelected: () => boolean;
  askChangeCompany: () => void;
  doSecuredRoute: () => void;
  applyStorage: (user: AuthResponse, company: Company) => void;
}

const AuthContext = createContext<AuthType>({
  user: null,
  companySelected: null,
  loadedStorage: false,
  isLogged: () => false,
  login: () => { },
  logout: () => { },
  setCompany: (company: Company, user: AuthResponse) => { },
  isCompanySelected: () => false,
  askChangeCompany: () => { },
  doSecuredRoute: () => { },
  applyStorage: (user: AuthResponse, company: Company) => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: JSX.Element }): JSX.Element {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [userLoadedStorage, setUserLoadedStorage] = useState<boolean>(false);
  const [companySelected, setCompanySelected] = useState<Company | null>(null);
  const [companyLoadedStorage, setCompanyLoadedStorage] = useState<boolean>(false);
  const [loadedStorage, setLoadedStorage] = useState<boolean>(false);
  const [isNavigationReady, rootNavigation] = useWaitNavigation();
  const router = useRouter();

  useEffect(() => {
    if (loadedStorage && isNavigationReady) {
      doSecuredRoute();
    }
  }, [user, companySelected, isNavigationReady]);

  useEffect(() => {
    setUserLoadedStorage(true);
  }, [user]);
  useEffect(() => {
    setCompanyLoadedStorage(true);
  }, [companySelected]);
  useEffect(() => {
    if (userLoadedStorage && companyLoadedStorage) setLoadedStorage(true);
  }, [userLoadedStorage, companyLoadedStorage]);

  const __storeUser = (user: AuthResponse | null) => {
    setUser(user);
    if (user) StorageUtils.storeData('user', JSON.stringify(user));
    else StorageUtils.removeData('user');
  }

  const __storeCompany = (company: Company | null) => {
    setCompanySelected(company);
    if (company) StorageUtils.storeData('company', JSON.stringify(company));
    else StorageUtils.removeData('company');
  }

  const changeUser = (user: AuthResponse | null) => {
    __storeUser(user);
    changeCompanySelected(null, null);
  }

  const changeCompanySelected = (company: Company | null, userCompany: AuthResponse | null) => {
    __storeCompany(company);
    if (userCompany) {
      __storeUser({
        ...user!,
        ...({
          access_token: userCompany.access_token,
          type: userCompany.type,
          companyData: userCompany.companyData
        })
      });
    }
  }

  const login = (user: AuthResponse) => changeUser(user);
  const setCompany = (company: Company, userCompany: AuthResponse) => changeCompanySelected(company, userCompany);
  const logout = () => changeUser(null);
  const isLogged = () => !!user;
  const isCompanySelected = () => !!companySelected;
  const askChangeCompany = () => {
    changeCompanySelected(null, null);
    router.replace('(private)/listCompanies');
  }
  const doSecuredRoute = () => {
    if (isNavigationReady && loadedStorage) {
      if (user && companySelected) {
        router.replace('(private)/documents')
      } else if (user && !companySelected) {
        router.replace('(private)/listCompanies')
      } else {
        router.replace('(public)/login')
      }
    }
  }
  const applyStorage = (storageUser: AuthResponse, storageCompany: Company) => {
    if (storageUser && storageUser !== user) setUser(storageUser);
    else setUserLoadedStorage(true);
    if (storageCompany && storageCompany !== companySelected) setCompanySelected(storageCompany);
    else setUserLoadedStorage(true);
  }

  const authContext: AuthType = {
    user,
    companySelected,
    loadedStorage,
    login,
    logout,
    isLogged,
    setCompany,
    isCompanySelected,
    askChangeCompany,
    doSecuredRoute,
    applyStorage
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}