/*
 * Copyright (C) Highsoft AS
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/**
 * Formats a timestamp with scale.
 *
 * @param {number} timestamp
 *        Time in milliseconds
 *
 * @return {string}
 *         Time in a scaled format
 */
function scale(timestamp) {

    const scaledTime = [];

    if (timestamp > HOUR) {
        scaledTime.push(Math.floor(timestamp / HOUR) + ' h');
        timestamp = timestamp % HOUR;
    }

    if (timestamp > MINUTE ||
        (scaledTime.length > 0 && timestamp > 0)
    ) {
        scaledTime.push(Math.floor(timestamp / MINUTE) + ' m');
        timestamp = timestamp % MINUTE;
    }

    if (timestamp > SECOND ||
        (scaledTime.length > 0 && timestamp > 0)
    ) {
        scaledTime.push(Math.floor(timestamp / SECOND) + ' s');
        timestamp = timestamp % SECOND;
    }

    if (timestamp > 0 ||
        scaledTime.length === 0
    ) {
        scaledTime.push(timestamp + ' ms');
    }

    return scaledTime.join(' ');
}

/**
 * Extracts the time from a date object.
 *
 * @param {Date} date
 *        Date to extract time from
 *
 * @return {string}
 *         Extracted time
 */
function time(date) {
    return date.toTimeString().substr(0, 8);
}

module.exports = {
    HOUR,
    MINUTE,
    SECOND,
    scale,
    time
};
