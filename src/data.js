import moment from "moment/moment";

const rnd = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export const generateGroups = n => Array.from(Array(n), (_, id) => ({id, title: `group ${id}`}));

export const generateItems = (from, to, groups, max_duration = 5) => {
    const hours = moment(to).diff(moment(from), "hours");
    const count = Math.floor(hours / 30 * groups);

    console.log("generateItems", moment(from).toJSON(), moment(to).toJSON(), groups, hours, count)

    if (count <= 0) {
        return []
    }

    return Array.from(Array(count), (_, id) => {
        const duration = rnd(max_duration, 1);
        const start_time = moment(from).add(rnd(hours - duration), 'hours');
        const end_time = moment(start_time).add(duration, 'hours');

        return {
            id,
            title: `item ${id}`,
            group: rnd(groups),
            start_time,
            end_time
        }
    })
};
