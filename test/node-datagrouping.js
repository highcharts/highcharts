/*
 * This is an example of running data grouping in a server environment to avoid
 * the overhead of first sending high-resolution data over the network and then
 * spending browser CPU to perform the grouping.
 *
 * The example takes hourly input data and demonstrates how to group it into
 * daily average values.
 *
 * Usage (from highcharts root)
 * `node test/node-datagrouping`
 */


/* eslint-env node, es6 */
/* eslint-disable no-console */
const Highcharts = require('../code/highcharts.src.js')();
const dataGrouping = require('../code/modules/datagrouping.src.js')(Highcharts);

// Generate some random, high-resolution data. This function emulates raw data
// with an hourly resolution that we want to group into days.
const [xData, yData] = (function () {
    const xs = [];
    const ys = [];
    let x,
        y = 0;
    for (
        x = Date.UTC(2019, 0, 1);
        x < Date.UTC(2019, 11, 31, 23, 59, 59);
        x += 36e5 // Increase by one hour
    ) {
        xs.push(x);
        ys.push(y++);
    }
    return [xs, ys];
}());

// First, get the tick distribution where we want the data to be grouped. In
// this example we are dealing with time data, so we use Highcharts.Time to find
// natural time divisions. For non-timebased data, these group positions can be
// on round numbers, like [0, 10, 20, 30] etc.
const time = new Highcharts.Time();
const groupPositions = time.getTimeTicks(
    {
        // One tick per day
        unitRange: 24 * 36e5
    },
    xData[0], // From
    xData[xData.length - 1] // To
);

// Next, group the data by the groupPositions.
const approximation = 'average'; // See https://api.highcharts.com/highstock/series.line.dataGrouping.approximation
const {
    groupedXData,
    groupedYData
} = dataGrouping.groupData(xData, yData, groupPositions, approximation);

// Optionally, transform it to a Highcharts-compatible two-dimensional array.
const data = groupedXData.map((x, i) => [x, groupedYData[i]]);

console.log(data);
