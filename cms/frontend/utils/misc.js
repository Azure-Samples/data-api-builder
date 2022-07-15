// Returns the difference between the current datetime and the date param
// Returns the least granular time unit
// ex: if it's been 15 months, will return '1 year'
// ex: if it's been 150 minutes, will return '2 hours'
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
        results.push(x > 1 ? `${x} ${time[0]}s` : x == 1 ? `${x} ${time[0]}` : '0');
    })
    // ltu - largest time unit
    const ltu = results.find(element => element != '0');
    // If not even seconds is non-zero, it's 'a moment' ago
    return (ltu == null || ltu == undefined) ? 'a moment': ltu; 
}