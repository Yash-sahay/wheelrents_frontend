import * as actionTypes from "../types";

const initalState = {
    loading: false,
}

    const loaderReducer = (state = initalState, action) => {
        switch (action.type) {
            case actionTypes.LOADER_DATA:
                return {
                    ...state,
                    ...action.payload
                }
            default: return state
        };
    }

    export function updateLoaderReducer(data) {

        return {
            type: actionTypes.LOADER_DATA,
            payload: data,
        }
    }

export default loaderReducer;

