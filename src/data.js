import moment from "moment/moment";

const rnd = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export const generateGroups = n => Array.from(Array(n), (_, id) => ({id, title: `group ${id}`}));

export const generateItems = (startId, from, to, groups, max_duration = 5) => {
    const hours = moment(to).diff(moment(from), "hours");
    const count = Math.floor(hours / 30 * groups);

    if (count <= 0) {
        return []
    }

    console.log("generateItems", moment(from).toDate(), moment(to).toDate(), count)

    const items = Array.from(Array(count), (_, index) => {
        const duration = rnd(max_duration, 1);
        const start_time = moment(from).add(rnd(hours - duration), 'hours');
        const end_time = moment(start_time).add(duration, 'hours');

        const id = startId + index;

        return {
            id,
            title: `item ${id}`,
            group: rnd(groups),
            start_time: +start_time.toDate(),
            end_time: +end_time.toDate()
        }
    });

    return items
};
