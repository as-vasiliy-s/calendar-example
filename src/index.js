import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from "moment/moment";

import {createStore} from 'redux'
import {calendarApp} from './reducer'
import {Provider} from 'react-redux'

export default function renderCalendar(elementId, defaultTimeStart = moment().startOf("day"), defaultTimeEnd = moment().endOf("day")) {
    const store = createStore(calendarApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    render(
        <Provider store={store}>
            <App {...{defaultTimeStart, defaultTimeEnd}}/>
        </Provider>, document.getElementById(elementId));

    registerServiceWorker();
}

// if (process.env.NODE_ENV !== 'production') {
//     renderCalendar('root');
// } else {
//     window.renderCalendar = renderCalendar;
// }

renderCalendar('root');
