
import axiosInstance from "../axios";
const url = 'api/service/'



// Login user
export function get_vehicle_categories() {
    return axiosInstance.get(url + 'get_vehicle_categories');
};
// Get Search Values
export function searchApi(string) {
    return axiosInstance.get(url + 'search/' + string);
};