// Returns the difference between the current datetime and the date param
// Returns the least granular time unit
// ex: if it's been 15 months, will return '1 year'
// ex: if it's been 150 minutes, will return '2 hours'
export const human_time_diff = (date) => {
    // Date is stored as UTC in MS SQL, must append 'Z' for date constructor to interpret
    let milliDiff = new Date() - new Date(`${date}Z`);
    if (milliDiff <= 0) return "a moment"; // Published date in the future? Sign of mismatched timezone.
    const times = [
        ['year', 31536000000],
        ['month', 2628000000],
        ['week', 606461000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
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

// Return true if input is falsy (null/undefined) or whitespace
export const isNullOrWhitespace = (input) => {
    return !input || !input.trim();
}

// Chakra UI toast helpers
export const surface_appropriate_error = (toast, err) => {
    toast.closeAll();
    if (err.status != null && err.status != undefined) { // more than likely an error surfaced by hawaii
        error_toast(toast, { title: `${err.status}`, description: err.status == 403 ? `Unauthorized` : `${err.statusText}` })
    } else {
        error_toast(toast, { title: "Fetch/Network Error", description: "Check network connection and/or developer console" })
    }
}

export const error_toast = (toast, options) => {
    toast_helper(toast, { ...options, status: 'error' });
}

export const success_toast = (toast, options) => {
    toast_helper(toast, { ...options, status: 'success' });
}

export const info_toast = (toast, options) => {
    toast_helper(toast, { ...options, status: 'info' });
}

export const warning_toast = (toast, options) => {
    toast_helper(toast, { ...options, status: 'warning' });
}

const toast_helper = (toast, options) => {
    toast({
        ...options,
        duration: 8000,
        isClosable: true
    });
}