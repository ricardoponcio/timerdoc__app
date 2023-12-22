import { useAuth } from '@/context/AuthProvider';
import { Api } from '@/utils/Api';
import { useRef, useState } from 'react';

export enum HTTP_VERB {
  GET = "get", POST = "post", PATCH = "patch", DELETE = "delete"
}

export function useRequest<T>(verb: HTTP_VERB, path?: string): [(data: any | null, extraConfig?: any | null, newPath?: string) => Promise<T>, any] {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const callerFn = (data: any | null, extraConfig?: any | null, newPath?: string): Promise<any> => {
    const client = Api.getApi(user?.access_token);
    const api = client[verb];

    const callPath = newPath || path || '';
    const axiosPromise = (verb === HTTP_VERB.GET ? api<T>(callPath, extraConfig) : api<T>(callPath, data, extraConfig));
    setLoading(true);
    return axiosPromise.then(result => {
      setLoading(false)
      if(result.status === 403 || result.status === 401) logout();
      return result.data;
    }).catch(err => {
      console.log(err?.response?.data);
      setLoading(false);
      throw err;
    });
  };

  return [callerFn, loading];
}
