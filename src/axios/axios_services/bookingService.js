
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
// status change paymnet in host bookings
export function booking_payment(data) {
    return axiosInstance.post(url + 'booking_payment', data);
};

// status change paymnet in host bookings
export function get_transaction_details(data) {
    return axiosInstance.post(url + 'get_transaction_details', data);
};

// status change paymnet in host bookings
export function extend_trip(data) {
    return axiosInstance.post(url + 'extend_trip', data);
};
// status change paymnet in host bookings
export function finish_trip(data) {
    return axiosInstance.post(url + 'finish_trip', data);
};