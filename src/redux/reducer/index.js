import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loaderReducer from './loaderReducer';
import locationReducer from './locationReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
    userReducer: userReducer,
    loaderReducer: loaderReducer,
    locationReducer: locationReducer,
    notificationReducer: notificationReducer,
});

export default rootReducer;