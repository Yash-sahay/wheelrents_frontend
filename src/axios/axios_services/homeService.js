
import axiosInstance from "../axios";
const url = 'api/service/'



// Login user
export function get_vehicle_categories() {
    return axiosInstance.get(url + 'get_vehicle_categories');
};

// Login user
export function get_vehicle_sub_categroy_by_id({vehicleTypeId}) {
    return axiosInstance.get(url + 'get_vehicle_sub_categroy_by_id/' + vehicleTypeId);
};
// Get Search Values
export function searchApi(string, data) {
    return axiosInstance.post(url + 'search/' + string, data);
};
// Get Banner Images
export function get_banner_images() {
    return axiosInstance.get(url + 'get_banner_images');
};

// Get Booking transactioon by user
export function get_booking_transaction_by_user() {
    return axiosInstance.get(url + 'get_booking_transaction_by_user');
};

// Get Banner Images
export function update_host_payment_status(data) {
    return axiosInstance.post(url + 'update_host_payment_status', data);
};