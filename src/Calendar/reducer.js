import sortedUniq from "lodash/sortedUniq"
import reject from "lodash/reject"
import groupBy from "lodash/groupBy"
import sortBy from "lodash/sortBy"
import mapValues from "lodash/mapValues"
import mergeWith from "lodash/mergeWith"
import forEach from "lodash/forEach"

import {SET_GROUPS, SET_ITEMS, EXPAND_LEFT, EXPAND_RIGHT, SET_GROUP_VISIBILITY} from "./actions";

const initialState = {
    left: null,
    right: null,
    groups: [],
    items: {},
    visible_groups: [],
    visible_groups_step: 5,
};

const groupItems = (items, step) => groupBy(items, ({group}) => Math.floor(group / step) * step);
const sortGroupedItems = (groupedItems) => mapValues(groupedItems, items => sortBy(items, 'start'));

const expandLeft = (target, megred) => [...megred, ...target];
const expandRight = (target, megred) => [...target, ...megred];

function calendarStore(state = initialState, action) {
    switch (action.type) {
        case SET_GROUPS:
            return {...state, groups: action.groups};
        case SET_ITEMS:
            return {
                ...state,
                left: action.left,
                right: action.right,
                items: sortGroupedItems(groupItems(action.items, state.visible_groups_step)),
            };
        case EXPAND_LEFT:
            return {
                ...state,
                left: action.left,
                items: mergeWith(state.items, sortGroupedItems(groupItems(action.items, state.visible_groups_step)), expandLeft),
            };
        case EXPAND_RIGHT:
            return {
                ...state,
                right: action.right,
                items: mergeWith(state.items, sortGroupedItems(groupItems(action.items, state.visible_groups_step)), expandRight),
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