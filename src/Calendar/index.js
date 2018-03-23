import React, {Component} from 'react';

import Timeline from 'react-calendar-timeline/lib';

import moment from "moment/moment";

import {connect} from 'react-redux'
import {setGroups, setItems, expandLeft, expandRight, setGroupVisibility} from './actions'

import sortedIndexBy from 'lodash/sortedIndexBy'
import sortedLastIndexBy from 'lodash/sortedLastIndexBy'
import forEach from "lodash/forEach"
import debounce from "lodash/debounce"

import VisibilitySensor from 'react-visibility-sensor'

const LOAD_DEPTH = [6, "days"];
const ITEMS_DEPTH = 48 * 3600 * 1000;
const GROUPS_REFRESH_DEBOUNCE = 200;

class Calendar extends Component {
    constructor(props) {
        super(props);
        const {timeline: {defaultTimeStart, defaultTimeEnd}} = props;
        const diff = moment(defaultTimeEnd).diff(moment(defaultTimeStart));

        this.state = {
            start: +moment(defaultTimeStart).subtract(diff).toDate(),
            end: +moment(defaultTimeEnd).add(diff).toDate(),
        };
    }

    ajaxError = (message) => (error) => alert(`Oops... ${message} AJAX error:\n\n${error}`);

    componentDidMount() {
        const {timeline: {defaultTimeStart, defaultTimeEnd}, getGroups, getEvents} = this.props;

        const diff = moment(defaultTimeEnd).diff(moment(defaultTimeStart));
        const left = moment(defaultTimeStart).subtract(diff).toDate();
        const right = moment(defaultTimeEnd).add(diff).toDate();

        Promise.all(
            [getGroups(), getEvents(left, right)]
        ).then(([groups, events]) => {
            this.props.setGroups(groups);
            this.props.setItems(left, right, events);
            this.setState({start: +left, end: +right})
        }).catch(
            this.ajaxError('initial data retreive')
        );
    }

    onBoundsChange = (boundsStart, boundsEnd) => {
        boundsStart = moment(boundsStart);
        boundsEnd = moment(boundsEnd);

        // console.log("onBoundsChange", boundsStart.toString(), boundsEnd.toString());

        let {left, right, getEvents} = this.props;
        left = moment(left);
        right = moment(right);

        if (boundsStart < left) {
            const minStart = moment(left).subtract(...LOAD_DEPTH);
            const loadingStart = boundsStart < minStart ? boundsStart : minStart;
            getEvents(loadingStart.toDate(), left.toDate()).then(events => {
                this.props.expandLeft(loadingStart.toDate(), events);
            }).catch(
                this.ajaxError('retreive Events (left)')
            );
        }

        if (boundsEnd > right) {
            const minEnd = moment(right).add(...LOAD_DEPTH);
            const loadingEnd = boundsEnd > minEnd ? boundsEnd : minEnd;
            getEvents(right.toDate(), loadingEnd.toDate()).then(events => {
                this.props.expandRight(loadingEnd.toDate(), events);
            }).catch(
                this.ajaxError('retreive Events (right)')
            );
        }

        const {start: currentStart, end: currentEnd} = this.state;
        const start = +boundsStart.toDate(), end = +boundsEnd.toDate();
        if (start < currentStart || end > currentEnd) {
            this.setState({start: start - ITEMS_DEPTH, end: end + ITEMS_DEPTH})
        }
    };

    visibilityIndexes = {};

    refreshGroupVisibility = debounce(() => {
        // console.log("SetVisibility", this.visibilityIndexes);
        this.props.setGroupVisibility(this.visibilityIndexes);
        this.visibilityIndexes = {};
    }, GROUPS_REFRESH_DEBOUNCE, {leading: false, trailing: true});

    accumulateGroupVisibility = (index, isVisible) => {
        const oldVal = this.visibilityIndexes[index] || 0;
        this.visibilityIndexes[index] = oldVal + (isVisible ? 1 : -1);
        // console.log(`Accumulate ${index}::${isVisible}; ${oldVal} => ${this.visibilityIndexes[index]}`, this.visibilityIndexes);
    };

    onChangeGroupVisibility = (id) => (isVisible) => {
        // console.log("Change", id, isVisible);
        this.accumulateGroupVisibility(id, isVisible);
        this.refreshGroupVisibility()
    };

    groupsToShow = () => {
        const {visible_groups, visible_groups_step: step} = this.props;
        const minGroup = visible_groups[0];
        return [...(minGroup ? [minGroup - step] : []), ...visible_groups]
    };

    groupRenderer = ({group}) => {
        const {visible_groups_step: step, timeline: {keys: {groupTitleKey}}, groupsIdToIndex} = this.props;
        const {id, [groupTitleKey]: title, account} = group;
        const index = groupsIdToIndex[id];

        const style = account ? {} : {fontWeight: 'bold'};

        if (index % step === 0) {
            return (
                <VisibilitySensor onChange={this.onChangeGroupVisibility(index)}>
                    <div title={index} style={style}>[{title}]</div>
                </VisibilitySensor>)
        } else {
            return <div title={index} style={style}>{title}</div>
        }
    };

    searchStartIndex = (items, value, key) => sortedIndexBy(items, {[key]: value}, key);
    searchEndIndex = (items, value, key) => sortedLastIndexBy(items, {[key]: value}, key);

    render() {
        const {groups, items: storeItems, timeline: timelineOptions} = this.props;

        const {start, end} = this.state;

        let items = [];
        const groupsToShow = this.groupsToShow();

        const {keys: {itemTimeStartKey: key}} = timelineOptions;

        forEach(groupsToShow, group => {
            const groupItems = storeItems[group];
            if (groupItems) {
                const startIndex = this.searchStartIndex(groupItems, start, key);
                const endIndex = this.searchEndIndex(groupItems, end, key);
                const cropedItems = groupItems.slice(startIndex, endIndex);
                items = [...items, ...cropedItems];
            }
        });

        console.log("render", items.length, groupsToShow);

        return (
            <Timeline
                {...{...timelineOptions, groups, items,}}
                onBoundsChange={this.onBoundsChange}
                groupRenderer={this.groupRenderer}
            />
        );
    }
}

Calendar.default_props = {
    timeline: {
        fullUpdate: false,

        canChangeGroup: false,

        minZoom: 2 * 60 * 60 * 1000,
        maxZoom: 7 * 86400 * 1000,

        keys: {
            groupIdKey: 'id',
            groupTitleKey: 'name',
            itemIdKey: 'id',
            itemTitleKey: 'title',
            itemDivTitleKey: 'tooltip',
            itemGroupKey: 'group',
            itemTimeStartKey: 'start',
            itemTimeEndKey: 'end'
        }
    }
};


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
)(Calendar);
