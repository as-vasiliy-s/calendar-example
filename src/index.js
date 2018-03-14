import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from "moment/moment";

import {createStore} from 'redux'
import {calendarApp} from './reducer'
import {Provider} from 'react-redux'

let store = createStore(calendarApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const defaultTimeStart = moment().startOf("day");
const defaultTimeEnd = moment().endOf("day");

// TODO: check https://github.com/fkhadra/react-on-screen
// TODO: check https://github.com/joshwnj/react-visibility-sensor

render(
    <Provider store={store}>
        <App {...{defaultTimeStart, defaultTimeEnd}}/>
    </Provider>, document.getElementById('root'));

registerServiceWorker();
