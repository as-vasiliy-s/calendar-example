import moment from "moment/moment";

export let itemsIdCounter = 0;

const rnd = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export const generateGroups = n => Array.from(Array(n), (_, id) => ({id, name: `group ${id}`, index: id}));

export const generateItems = (from, to, groups, max_duration = 5) => {
    const hours = moment(to).diff(moment(from), "hours");
    const count = Math.floor(hours / 30 * groups);

    if (count <= 0) {
        return []
    }

    console.log("generateItems", moment(from).toDate(), moment(to).toDate(), count);

    const items = Array.from(Array(count), (_, index) => {
        const duration = rnd(max_duration, 1);
        const start_time = moment(from).add(rnd(hours - duration), 'hours');
        const end_time = moment(start_time).add(duration, 'hours');

        const id = itemsIdCounter + index;

        return {
            id,
            title: `item ${id}`,
            tooltip: `item ${id}\n${start_time.toString()}\n${end_time.toString()}`,
            group: rnd(groups),
            start: +start_time.toDate(),
            end: +end_time.toDate(),
        }
    });

    itemsIdCounter += count;

    return items
};
