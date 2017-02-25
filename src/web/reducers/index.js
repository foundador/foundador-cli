import { combineReducers } from 'redux'
import initialState from './initialState';

import {
    DEFAULT_ACTION
} from '../actions/types';

function cloneState(state) {
  if(!state) {
    return null;
  }
  switch((state).constructor) {
    case Object:
      return Object.assign({}, state);
    case Array:
      return [].concat(state);
    case String:
      return "" + state;
    case Number:
      return 0 + state;
    case Boolean:
      return true && state;
    default:
      return null;
  }
}

function defaultState(state = initialState.defaultState, action) {
  let newState = cloneState(state);
  switch(action.type) {
    case DEFAULT_ACTION:
      newState = action.value;
    break;
  }
  return newState;
}

const rootReducer = combineReducers({
  defaultState
});

export default rootReducer;
