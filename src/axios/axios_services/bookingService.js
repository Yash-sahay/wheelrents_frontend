
import axiosInstance from "../axios";
const url = 'api/bookings/'


// Added By User
export function createBooking({data}) {
    return axiosInstance.post(url + 'add', data);
};
// get host bookings
export function getBookingsForHost() {
    return axiosInstance.post(url + 'get_host_bookings');
};