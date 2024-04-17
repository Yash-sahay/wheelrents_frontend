import * as actionTypes from "../types";

const initalState = {
    userId: '',
    username: '',
    isLoggedIn: '',
    otp: '',
    loader: false,
    searchValue: '',
    pageCounter: 0,
    isOpenDrawer: false,
    notificationCount: 0,
    lat: null,
    long: null,
    role: null,
    bookingStartDate: new Date(),
    searchString: "",
    recentSearches: [],
    bookingEndDate: new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
}

    const userReducer = (state = initalState, action) => {
        switch (action.type) {
            case actionTypes.LOGIN_DATA:
                return {
                    ...state,
                    ...action.payload
                }
            default: return state
        };
    }

    export function updateUserDetails(data) {

        return {
            type: actionTypes.LOGIN_DATA,
            payload: data,
        }
    }

export default userReducer;

