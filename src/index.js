import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import 'element-theme-default';
import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/en'

//Redux setup with middleware for async actions
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducer from "./reducers"
import { createStore, applyMiddleware } from "redux";
import {Provider} from 'react-redux';

const logger = createLogger();
const store = createStore(reducer,
  applyMiddleware(
    thunkMiddleware,
    logger
  ))

i18n.use(locale);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
