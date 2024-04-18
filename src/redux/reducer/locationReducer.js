import * as actionTypes from "../types";

const initalState = {
    "ISO3166-2-lvl4": "", 
    "city": "", 
    "country": "", 
    "country_code": "", 
    "county": "", 
    "postcode": "", 
    "road": "", 
    "state": ""
}
    const locationReducer = (state = initalState, action) => {
        switch (action.type) {
            case actionTypes.LOCATION_DATA:
                return {
                    ...state,
                    ...action.payload
                }
            default: return state
        };
    }

    export function updateLocationReducer(data) {

        return {
            type: actionTypes.LOCATION_DATA,
            payload: data,
        }
    }

export default locationReducer;

