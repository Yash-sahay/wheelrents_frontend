
import axiosInstance from "../axios";
const url = 'api/auth/'



// Login user
export function loginUser({config, data}) {
    return axiosInstance.post(url + 'login', data);
};

// create user
export function createuser({config, data}) {
    return axiosInstance.post(url + 'createuser', data);
};

// OTP user
export function otpUser(config, data) {
    return axiosInstance.post(url + 'login_api', data);
};

// Logout user
export async function logOut (data) {
    return axiosInstance.post(url + 'logout', data);
};
