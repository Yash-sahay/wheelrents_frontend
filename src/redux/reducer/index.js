import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loaderReducer from './loaderReducer';

const rootReducer = combineReducers({
    userReducer: userReducer,
    loaderReducer: loaderReducer,
});

export default rootReducer;