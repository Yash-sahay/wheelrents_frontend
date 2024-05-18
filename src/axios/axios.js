import axios from "axios";
import { Alert, ToastAndroid } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from "../../common";

const axiosInstance = axios.create({
    baseURL: baseURL(),
});


// To get stored Access tokens 
const getStoredToken = async () => {
    try {
        const storing = await AsyncStorage.getItem('Tokens');
        // We have data!!
        return JSON.parse(storing);
    } catch (error) {
        console.error(error);
    }
}

axiosInstance.interceptors.request.use(
    async (config) => {
        const authObj = await getStoredToken();
        if (authObj?.access) {
            // config.timeout = 1000 * 5
            // config.headers.common['Authorization'] = `Bearer ${authObj?.access}` || "";
            config.headers.Authorization = `Bearer ${authObj?.access}` || ""
        }
        // console.warn(config)
        return config;
    },
    (error) => {
        alert(error);
        return Promise.reject(error);
    });

axiosInstance.interceptors.response.use(
    (response) => { // Any status code from range of 2xx
        return response;
    },
    (error) => { // Any status codes outside range of 2xx
        ToastAndroid.showWithGravityAndOffset(
            "SERVER ERROR",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        console.error("Error", error.message);
        return Promise.reject(error);
    });

export default axiosInstance;