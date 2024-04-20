
import axiosInstance from "../axios";
const url = 'api/service/'



// Login user
export function get_vehicle_categories() {
    return axiosInstance.get(url + 'get_vehicle_categories');
};
// Get Search Values
export function searchApi(string, data) {
    return axiosInstance.post(url + 'search/' + string, data);
};
// Get Banner Images
export function get_banner_images() {
    return axiosInstance.get(url + 'get_banner_images');
};