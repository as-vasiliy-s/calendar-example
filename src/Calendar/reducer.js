import sortedUniq from "lodash/sortedUniq"
import reject from "lodash/reject"
import groupBy from "lodash/groupBy"
import sortBy from "lodash/sortBy"
import mapValues from "lodash/mapValues"
import mergeWith from "lodash/mergeWith"
import forEach from "lodash/forEach"
import map from "lodash/map"
import keyBy from "lodash/keyBy"

import {SET_GROUPS, SET_ITEMS, EXPAND_LEFT, EXPAND_RIGHT, SET_GROUP_VISIBILITY} from "./actions";

const initialState = {
    left: null,
    right: null,
    groups: [],
    groupsIdToIndex: {},
    items: {},
    visible_groups: [],
    visible_groups_step: 5,
};

const groupItems = (items, step, groupsIdToIndex) => groupBy(items, ({group}) => Math.floor(groupsIdToIndex[group] / step) * step);
const sortGroupedItems = (groupedItems) => mapValues(groupedItems, items => sortBy(items, 'start'));

const expandLeft = (target, megred) => [...megred, ...target];
const expandRight = (target, megred) => [...target, ...megred];

function calendarStore(state = initialState, action) {
    switch (action.type) {
        case SET_GROUPS:
            const groupsById = keyBy(action.groups, 'id');
            const addSortKeys = ({account, name, ...rest}) => ({
                ...rest, account, name,
                sort1: (account ? groupsById[account].name : name),
                sort2: (account ? name : '')
            });
            const groups = sortBy(map(action.groups, addSortKeys), ['sort1', 'sort2']);
            const groupsIdToIndex = mapValues(keyBy(map(groups, ({id}, index) => ({id, index})), 'id'), 'index');
            return {...state, groups, groupsIdToIndex};
        case SET_ITEMS:
            return {
                ...state,
                left: action.left,
                right: action.right,
                items: sortGroupedItems(groupItems(action.items, state.visible_groups_step, state.groupsIdToIndex)),
            };
        case EXPAND_LEFT:
            return {
                ...state,
                left: action.left,
                items: mergeWith(state.items, sortGroupedItems(groupItems(action.items, state.visible_groups_step, state.groupsIdToIndex)), expandLeft),
            };
        case EXPAND_RIGHT:
            return {
                ...state,
                right: action.right,
                items: mergeWith(state.items, sortGroupedItems(groupItems(action.items, state.visible_groups_step, state.groupsIdToIndex)), expandRight),
            };
        case SET_GROUP_VISIBILITY:
            let added = [], removed = {};

            forEach(action.visibilityIndexes, (count, index) => {
                if (count > 0) {
                    added.push(index)
                } else if (count < 0) {
                    removed[index] = true
                }
            });

            let visible_groups = [...added, ...state.visible_groups];
            visible_groups = sortedUniq(reject(visible_groups, (index) => removed[index]).sort((a, b) => a - b))

            return {...state, visible_groups};
        default:
            return state
    }
}

export default calendarStore;