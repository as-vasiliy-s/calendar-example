import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import moment from "moment/moment";

const rnd = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
const generateGroups = n => Array.from(Array(n), (_, id) => ({id, title: `group ${id}`}));

const generateItems = (n, groups, hours = 5 * 24) => {
    return Array.from(Array(n), (_, id) => {
        const start_time = moment().add(rnd(hours, -hours), 'hours');
        const duration = rnd(9, 1);
        const end_time = moment(start_time).add(duration, 'hours');

        return {
            id,
            title: `item ${id}`,
            group: rnd(groups),
            start_time,
            end_time
        }
    })
};

const groups = generateGroups(1000);
const items = generateItems(6000, 1000);

ReactDOM.render(<App groups={groups} items={items}/>, document.getElementById('root'));
registerServiceWorker();
