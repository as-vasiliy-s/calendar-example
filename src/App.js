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
import reject from "lodash/reject"

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

    onBoundsChange = (start, end) => {
        const MIN_DEPTH = [6, "days"];

        start = moment(start);
        end = moment(end);

        console.log("onBoundsChange", start.toDate(), end.toDate());

        let {left, right, counter} = this.props;
        left = moment(left);
        right = moment(right);

        if (start < left) {
            const minStart = moment(left).subtract(...MIN_DEPTH);
            const loadingStart = start < minStart ? start : minStart;
            const leftItems = generateItems(counter, loadingStart.toDate(), left.toDate(), ITEMS_GROUPS);
            this.props.expandLeft(loadingStart.toDate(), leftItems);
            counter += leftItems.length
        }

        if (end > right) {
            const minEnd = moment(right).add(...MIN_DEPTH);
            const loadingEnd = end > minEnd ? end : minEnd;
            const rightItems = generateItems(counter, right.toDate(), loadingEnd.toDate(), ITEMS_GROUPS);
            this.props.expandRight(loadingEnd.toDate(), rightItems);
        }

        this.setState({start: +start.toDate(), end: +end.toDate()})
    };

    onTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
        this.setState({visibleTimeStart, visibleTimeEnd});
    };

    onChange = (id) => (isVisible) => {
        this.props.setGroupVisibility(id, isVisible);
    };

    groupRenderer = ({group}) => {
        if (group.id % 10 === 0) {
            return (
                <VisibilitySensor onChange={this.onChange(group.id)}>
                    <div>[{group.title}]</div>
                </VisibilitySensor>)
        } else {
            return <div>{group.title}</div>
        }
    };

    render() {
        const {defaultTimeStart, defaultTimeEnd, start, end} = this.state;
        const {visibleTimeStart, visibleTimeEnd} = this.state;
        const {groups, items: allItems, visible_groups} = this.props;

        const startIndex = sortedIndexBy(allItems, {start_time: start}, 'start_time');
        const endIndex = sortedLastIndexBy(allItems, {start_time: end}, 'start_time');

        const allGroupsItems = allItems.slice(startIndex, endIndex);

        let {0: minId, [visible_groups.length - 1]: maxId} = visible_groups;
        minId -= 10;
        maxId += 10;

        const items = reject(allGroupsItems, ({group}) => group < minId || group > maxId);

        console.log("render", allItems.length, allGroupsItems.length, items.length, visible_groups, `[${startIndex}...${endIndex}]`);

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
                          onTimeChange={this.onTimeChange}
                          groupRenderer={this.groupRenderer}
                          {...{defaultTimeStart, defaultTimeEnd}}
                          {...{visibleTimeStart, visibleTimeEnd}}
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
