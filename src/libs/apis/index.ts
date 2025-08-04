import axios from 'axios';
import { toast } from 'react-toastify';
import { store } from '../redux/store';
import { navigate } from '@/utils/navigate';
import { logout } from '../redux/user/userSlice';

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
});

// Add a request interceptor
// component => axios => requrest interceptor => server
axiosClient.interceptors.request.use(
  function (config) {
    // get store outside component in react
    const accessToken = store.getState().user.accessToken;

    // Do something before request is sent
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.status === 401) {
      navigate('/sign-in');
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (Array.isArray(error?.response?.data?.message)) {
      toast.error(error?.response?.data?.message.join(','));
    }

    toast.error(error?.response?.data?.message || 'Something went wrong');
    return Promise.reject(error);
  }
);

export default axiosClient;
