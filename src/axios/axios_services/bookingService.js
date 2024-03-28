
import axiosInstance from "../axios";
const url = 'api/bookings/'


// Added By User
export function createBooking({data}) {
    return axiosInstance.post(url + 'add', data);
};