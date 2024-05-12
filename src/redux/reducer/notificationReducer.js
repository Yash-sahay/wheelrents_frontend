import * as actionTypes from "../types";

const initalState = {
    newNotification: false,
    notifications: []
}

    const notificationReducer = (state = initalState, action) => {
        switch (action.type) {
            case actionTypes.NOTIFICATION_DATA:
                return {
                    ...state,
                    ...action.payload
                }
            default: return state
        };
    }

    export function updateNotificationReducer(data) {

        return {
            type: actionTypes.NOTIFICATION_DATA,
            payload: data,
        }
    }

export default notificationReducer;

