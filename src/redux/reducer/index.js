import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loaderReducer from './loaderReducer';
import locationReducer from './locationReducer';

const rootReducer = combineReducers({
    userReducer: userReducer,
    loaderReducer: loaderReducer,
    locationReducer: locationReducer,
});

export default rootReducer;