import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import defaultsDeep from 'lodash/defaultsDeep'

import Calendar from './Calendar';

import {generateGroups, generateItems} from "./data";

const GROUPS = 1000;
const ITEMS_GROUPS = 1000;

const getGroups = () => Promise.resolve(generateGroups(GROUPS));

const getEvents = (from, to) => Promise.resolve(generateItems(from, to, ITEMS_GROUPS));

class App extends Component {
    render() {
        const {defaultTimeStart, defaultTimeEnd} = this.props;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Calendar {...{getGroups, getEvents, timeline: defaultsDeep({defaultTimeStart, defaultTimeEnd}, Calendar.default_props.timeline)}}/>
            </div>
        );
    }
}

export default App;
