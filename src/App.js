import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Timeline from 'react-calendar-timeline/lib';

import {generateGroups, generateItems} from "./data";
import moment from "moment/moment";

const GROUPS = 1000;

class App extends Component {
    constructor(props) {
        super(props);

        const {defaultTimeStart, defaultTimeEnd} = props;

        const diff = moment(defaultTimeEnd).diff(moment(defaultTimeStart));

        this.state = {
            groups: generateGroups(GROUPS),
            items: generateItems(moment(defaultTimeStart).subtract(diff), moment(defaultTimeEnd).add(diff), GROUPS)
        }
    }

    onBoundsChange = (canvasTimeStart, canvasTimeEnd) => {
        console.log("onBoundsChange", moment(canvasTimeStart).toJSON(), moment(canvasTimeEnd).toJSON())
        this.setState({items: generateItems(canvasTimeStart, canvasTimeEnd, GROUPS)})
    }

    render() {
        const {defaultTimeStart, defaultTimeEnd} = this.props;
        const {groups, items} = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Timeline groups={groups}
                          items={items}
                          defaultTimeStart={defaultTimeStart}
                          defaultTimeEnd={defaultTimeEnd}
                          onBoundsChange={this.onBoundsChange}
                />
            </div>
        );
    }
}

export default App;
