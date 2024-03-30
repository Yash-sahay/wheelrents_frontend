
import axiosInstance from "../axios";
const url = 'api/bookings/'


// Added By User
export function createBooking({data}) {
    return axiosInstance.post(url + 'add', data);
};
// get host bookings
export function getBookingsForHost(data) {
    return axiosInstance.post(url + 'get_host_bookings', data);
};
// delete host bookings
export function delete_booking_by_id({bookingId}) {
    return axiosInstance.delete(url + 'delete_booking_by_id/' + bookingId,);
};
// status change host bookings
export function booking_status_change(data) {
    return axiosInstance.post(url + 'booking_status_change', data);
};