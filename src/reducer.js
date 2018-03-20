import sortedUniq from "lodash/sortedUniq"
import reject from "lodash/reject"
import groupBy from "lodash/groupBy"
import sortBy from "lodash/sortBy"
import mapValues from "lodash/mapValues"
import mergeWith from "lodash/mergeWith"

import {SET_GROUPS, SET_ITEMS, EXPAND_LEFT, EXPAND_RIGHT, SET_GROUP_VISIBILITY} from "./actions";

const initialState = {
    counter: 0,
    left: null,
    right: null,
    groups: [],
    items: {},
    visible_groups: [],
    visible_groups_step: 10,
};

const groupItems = (items, step) => groupBy(items, ({group}) => Math.floor(group / step) * step);
const sortGroupedItems = (groupedItems) => mapValues(groupedItems, items => sortBy(items, 'start_time'));

const expandLeft = (target, megred) => [...megred, ...target];
const expandRight = (target, megred) => [...target, ...megred];

export function calendarApp(state = initialState, action) {
    switch (action.type) {
        case SET_GROUPS:
            return {...state, groups: action.groups};
        case SET_ITEMS:
            return {
                ...state,
                left: action.left,
                right: action.right,
                items: sortGroupedItems(groupItems(action.items, state.visible_groups_step)),
                counter: action.items.length,
            };
        case EXPAND_LEFT:
            return {
                ...state,
                left: action.left,
                items: mergeWith(state.items, sortGroupedItems(groupItems(action.items, state.visible_groups_step)), expandLeft),
                counter: state.counter + action.items.length
            };
        case EXPAND_RIGHT:
            return {
                ...state,
                right: action.right,
                items: mergeWith(state.items, sortGroupedItems(groupItems(action.items, state.visible_groups_step)), expandRight),
                counter: state.counter + action.items.length
            };
        case SET_GROUP_VISIBILITY:
            if (action.visibility) {
                return {...state, visible_groups: sortedUniq([action.id, ...state.visible_groups].sort((a, b) => a - b))}
            } else {
                return {
                    ...state,
                    visible_groups: reject(state.visible_groups, id => id === action.id).sort((a, b) => a - b)
                }
            }
        default:
            return state
    }
}
