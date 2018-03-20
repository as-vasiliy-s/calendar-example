import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Timeline from 'react-calendar-timeline/lib';

import {generateGroups, generateItems} from "./data";
import moment from "moment/moment";

import {connect} from 'react-redux'
import {setGroups, setItems, expandLeft, expandRight, setGroupVisibility} from './actions'

import sortedIndexBy from 'lodash/sortedIndexBy'
import sortedLastIndexBy from 'lodash/sortedLastIndexBy'
import forEach from "lodash/forEach"
import min from "lodash/min"
import max from "lodash/max"

import VisibilitySensor from 'react-visibility-sensor'

const GROUPS = 1000;
const ITEMS_GROUPS = 1000;

class App extends Component {
    constructor(props) {
        super(props);
        const {defaultTimeStart, defaultTimeEnd} = props;
        const diff = moment(defaultTimeEnd).diff(moment(defaultTimeStart));

        this.state = {
            defaultTimeStart,
            defaultTimeEnd,
            start: moment(defaultTimeStart).subtract(diff).toDate(),
            end: moment(defaultTimeEnd).add(diff).toDate(),
        };
    }

    componentDidMount() {
        const {defaultTimeStart, defaultTimeEnd, counter} = this.props;

        this.props.setGroups(generateGroups(GROUPS));

        const diff = moment(defaultTimeEnd).diff(moment(defaultTimeStart));
        const left = moment(defaultTimeStart).subtract(diff).toDate();
        const right = moment(defaultTimeEnd).add(diff).toDate();
        const items = generateItems(counter, left, right, ITEMS_GROUPS);

        this.props.setItems(left, right, items);
        this.setState({start: +left, end: +right})
    }

    onBoundsChange = (boundsStart, boundsEnd) => {
        const LOAD_DEPTH = [6, "days"];
        const ITEMS_DEPTH = 48 * 3600 * 1000;

        boundsStart = moment(boundsStart);
        boundsEnd = moment(boundsEnd);

        // console.log("onBoundsChange", start.toDate(), end.toDate());

        let {left, right, counter} = this.props;
        left = moment(left);
        right = moment(right);

        if (boundsStart < left) {
            const minStart = moment(left).subtract(...LOAD_DEPTH);
            const loadingStart = boundsStart < minStart ? boundsStart : minStart;
            const leftItems = generateItems(counter, loadingStart.toDate(), left.toDate(), ITEMS_GROUPS);
            this.props.expandLeft(loadingStart.toDate(), leftItems);
            counter += leftItems.length
        }

        if (boundsEnd > right) {
            const minEnd = moment(right).add(...LOAD_DEPTH);
            const loadingEnd = boundsEnd > minEnd ? boundsEnd : minEnd;
            const rightItems = generateItems(counter, right.toDate(), loadingEnd.toDate(), ITEMS_GROUPS);
            this.props.expandRight(loadingEnd.toDate(), rightItems);
        }


        const {start: currentStart, end: currentEnd} = this.state;
        const start = +boundsStart.toDate(), end = +boundsEnd.toDate();
        if (start < currentStart || end > currentEnd) {
            this.setState({start: start - ITEMS_DEPTH, end: end + ITEMS_DEPTH})
        }
    };

    onChange = (id) => (isVisible) => {
        this.props.setGroupVisibility(id, isVisible);
    };

    groupsToShow = () => {
        const {visible_groups, visible_groups_step: step} = this.props;
        return [min(visible_groups) - step, ...visible_groups, max(visible_groups) + step]
    };

    groupRenderer = ({group}) => {
        const {visible_groups_step: step} = this.props;

        if (group.id % step === 0) {
            return (
                <VisibilitySensor onChange={this.onChange(group.id)}>
                    <div>[{group.title}]</div>
                </VisibilitySensor>)
        } else {
            return <div>{group.title}</div>
        }
    };

    render() {
        const {defaultTimeStart, defaultTimeEnd} = this.state;
        const {groups, items: storeItems} = this.props;

        const {start, end} = this.state;

        let items = [];

        forEach(this.groupsToShow(), group => {
            const groupItems = storeItems[group];
            if (groupItems) {
                const startIndex = sortedIndexBy(groupItems, {start_time: start}, 'start_time');
                const endIndex = sortedLastIndexBy(groupItems, {start_time: end}, 'start_time');
                const cropedItems = groupItems.slice(startIndex, endIndex);
                items = [...items, ...cropedItems];
            }
        });

        const {counter, visible_groups} = this.props;
        console.log("render", counter, items.length, visible_groups);

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <Timeline groups={groups}
                          items={items}
                          minZoom={2 * 60 * 60 * 1000}
                          maxZoom={7 * 86400 * 1000}
                          fullUpdate={false}
                          onBoundsChange={this.onBoundsChange}
                          groupRenderer={this.groupRenderer}
                          {...{defaultTimeStart, defaultTimeEnd}}
                />
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => {
        return {
            expandLeft: (date, items) => dispatch(expandLeft(date, items)),
            expandRight: (date, items) => dispatch(expandRight(date, items)),
            setItems: (left, right, items) => dispatch(setItems(left, right, items)),
            setGroups: (groups) => dispatch(setGroups(groups)),
            setGroupVisibility: (id, visibility) => dispatch(setGroupVisibility(id, visibility))
        }
    }
)(App);
