import moment from "moment/moment";
import times from "lodash/times";

export let itemsIdCounter = 0;

const rnd = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
const sample = (array) => array[Math.floor(Math.random() * array.length)];

export const generateGroups = (n, topGroupsPart = 10) => {
    const topGroups = times(Math.floor(n / topGroupsPart) + 1, (i) => ({id: `A_${i}`, name: `account ${i}`}));
    const subGroups = times(n, (i) => ({id: `L_${i}`, name: `listing ${i}`, account: sample(topGroups).id}));
    return [...topGroups, ...subGroups]
};

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
            group: `L_${rnd(groups)}`,
            start: +start_time.toDate(),
            end: +end_time.toDate(),
        }
    });

    itemsIdCounter += count;

    return items
};
