export const SET_GROUPS = "SET_GROUPS";
export const SET_ITEMS = "SET_ITEMS";
export const EXPAND_LEFT = "EXPAND_LEFT";
export const EXPAND_RIGHT = "EXPAND_RIGHT";
export const SET_GROUP_VISIBILITY = "SET_GROUP_VISIBILITY";

export function setGroups(groups) {
    return {type: SET_GROUPS, groups}
}

export function setItems(left, right, items) {
    return {type: SET_ITEMS, left, right, items}
}

export function expandLeft(left, items) {
    return {type: EXPAND_LEFT, left, items}
}

export function expandRight(right, items) {
    return {type: EXPAND_RIGHT, right, items}
}

export function setGroupVisibility(visibilityIndexes) {
    return {type: SET_GROUP_VISIBILITY, visibilityIndexes}
}
