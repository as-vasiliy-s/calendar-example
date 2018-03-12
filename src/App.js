import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Timeline from 'react-calendar-timeline/lib';
import moment from 'moment';

class App extends Component {
    render() {
        const {groups, items} = this.props;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Timeline groups={groups}
                          items={items}
                          defaultTimeStart={moment().add(-12, 'hour')}
                          defaultTimeEnd={moment().add(12, 'hour')}
                />
            </div>
        );
    }
}

export default App;
