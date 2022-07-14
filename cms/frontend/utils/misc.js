export const human_time_diff = (date) => {
    let milliDiff = new Date() - new Date(date);
    const times = [
        ['year', 31536000000],
        ['month', 2628000000],
        ['week', 606461000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
        ['second', 1000]
    ];

    let results = []
    times.forEach((time) => {
        let x = Math.floor(milliDiff / (time[1]));
        milliDiff -= x * time[1];
        results.push(x > 1 ? `${x} ${time[0]}s` : x == 1 ? `${x} ${time[0]}` : `0`);
    })
    return results.find(element => element != `0`);
}