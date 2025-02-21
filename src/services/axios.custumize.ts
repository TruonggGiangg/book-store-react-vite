//can thiệp để định dạng res và req

import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});


instance.interceptors.request.use(function (config) {
    // Do something before request is sent

    const token = localStorage.getItem("access_token");
    // const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = "bearer " + token;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    if (response.data && response) {
        return response.data;
    }
}, function (error) {
    if (error && error.response && error.response.data) {
        return error.response.data
    }
});

export default instance;