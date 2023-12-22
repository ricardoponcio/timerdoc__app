import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { BackendUtils } from './BackendUtils';

export class Api {

    static getApiAuthToken() {
        const { user } = useAuth();
        return Api.getApi(user?.access_token);
    }

    static getApi(token?: string) {
        return axios.create({
            baseURL: BackendUtils.BaseURL,
            headers: {
                ...(token ? { 'Authorization': 'Bearer ' + token } : {})
            }
        });
    }

}