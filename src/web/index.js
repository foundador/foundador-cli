import React from 'react';
import {render} from 'react-dom';
import {createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk'

import rootReducer from './reducers';
import initialState from './reducers/initialState';

import css from './res/css/base.css';

let store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    thunkMiddleware
  )
);

import App from './components/App.js';

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
