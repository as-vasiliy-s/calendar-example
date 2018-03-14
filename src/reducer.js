import {SET_GROUPS, SET_ITEMS, EXPAND_LEFT, EXPAND_RIGHT} from "./actions";

const initialState = {
    counter: 0,
    left: null,
    right: null,
    groups: [],
    items: []
};

export function calendarApp(state = initialState, action) {
    switch (action.type) {
        case SET_GROUPS:
            return {...state, groups: action.groups};
        case SET_ITEMS:
            return {...state, left: action.left, right: action.right, items: action.items, counter: action.items.length};
        case EXPAND_LEFT:
            return {...state, left: action.left, items: [...action.items, ...state.items], counter: state.counter + action.items.length};
        case EXPAND_RIGHT:
            return {...state, right: action.right, items: [...state.items, ...action.items], counter: state.counter + action.items.length};
        default:
            return state
    }
}
