import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
    baseURL: window["apiLocation"],
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (window["accessToken"]) {
            config.headers.Authorization = `Bearer ${window["accessToken"]}`;
        }
        return config;
    },
    (error) => Promise.reject(error.response),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code == "ERR_NETWORK") {
            toast.error("Network Error")
        }
        return Promise.reject((error.response && error.response.data) || 'Something went wrong')
    }
);

export default axiosInstance;
