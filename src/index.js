import React from 'react';
import moment from "moment/moment";

import App from './App';
import {renderApp} from './index.prod'

const defaultTimeStart = moment().startOf("day").toDate();
const defaultTimeEnd = moment().endOf("day").toDate();

renderApp('root', <App {...{defaultTimeStart, defaultTimeEnd}}/>);
