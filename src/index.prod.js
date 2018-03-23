import React from 'react';
import {render} from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import defaultsDeep from 'lodash/defaultsDeep'

import {createStore} from 'redux'
import {Provider} from 'react-redux'

import calendarStore from './Calendar/reducer'

import Calendar from './Calendar';

export function renderApp(elementId, component) {
    const store = createStore(calendarStore, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    render(<Provider store={store}>{component}</Provider>, document.getElementById(elementId));
}

export function renderCalendar(elementId, options) {
    renderApp(elementId, <Calendar {...defaultsDeep(options, Calendar.default_props)}/>);
    registerServiceWorker();
}

window.renderCalendar = renderCalendar;