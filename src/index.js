import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from "moment/moment";

ReactDOM.render(<App
    defaultTimeStart={moment().add(-12, 'hour')}
    defaultTimeEnd={moment().add(12, 'hour')}/>, document.getElementById('root'));
registerServiceWorker();
