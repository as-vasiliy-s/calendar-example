import uniq from "lodash/uniq"
import reject from "lodash/reject"

import {SET_GROUPS, SET_ITEMS, EXPAND_LEFT, EXPAND_RIGHT, SET_GROUP_VISIBILITY} from "./actions";

const initialState = {
    counter: 0,
    left: null,
    right: null,
    groups: [],
    items: [],
    visible_groups: []
};

export function calendarApp(state = initialState, action) {
    switch (action.type) {
        case SET_GROUPS:
            return {...state, groups: action.groups};
        case SET_ITEMS:
            return {
                ...state,
                left: action.left,
                right: action.right,
                items: action.items,
                counter: action.items.length
            };
        case EXPAND_LEFT:
            return {
                ...state,
                left: action.left,
                items: [...action.items, ...state.items],
                counter: state.counter + action.items.length
            };
        case EXPAND_RIGHT:
            return {
                ...state,
                right: action.right,
                items: [...state.items, ...action.items],
                counter: state.counter + action.items.length
            };
        case SET_GROUP_VISIBILITY:
            if (action.visibility) {
                return {...state, visible_groups: uniq([action.id, ...state.visible_groups].sort((a, b) => a - b))}
            } else {
                return {...state, visible_groups: reject(state.visible_groups, id => id === action.id).sort((a, b) => a - b)}
            }
        default:
            return state
    }
}
