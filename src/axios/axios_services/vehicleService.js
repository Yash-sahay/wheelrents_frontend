
import axiosInstance from "../axios";
const url = 'api/vehicle/'


// Added By User
export function getAllVehicle({data}) {
    return axiosInstance.post(url + 'getbyuser', data);
};

// Add Vehicle By User
export function vehicleAdd({ data }) {
    return axiosInstance.post(url + 'add', data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Add Vehicle By User
export function updateVehicle({ data }) {
    console.warn(data)
    return axiosInstance.post(url + 'update', data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    });
};


// Get All Vehicle List 
export function getAllVehicleListings({data}) {
    return axiosInstance.post(url + 'get', data);
};


// Get Wishlist by user 
export function get_wishlist_by_user() {
    return axiosInstance.get(url + 'wishlist');
};

// Get Wishlist by user 
export function toggleWishListForUser({data}) {
    return axiosInstance.post(url + 'wishlist', data);
};

// Delete Wishlist by user 
export function deleteWishListData({data}) {
    return axiosInstance.delete(url + 'wishlistDelete/' + data.vehicleId );
};

// Delete Vehicle by host 
export function deleteVehicleFromHost({data}) {
    console.warn(data)
    return axiosInstance.delete(url + 'delete/' + data.vehicleId );
};