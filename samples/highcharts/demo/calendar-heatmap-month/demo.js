const data = [{
    date: '2017-05-01',
    temperature: 9.9
},
{
    date: '2017-05-02',
    temperature: 11.5
},
{
    date: '2017-05-03',
    temperature: 11.8
},
{
    date: '2017-05-04',
    temperature: 13.1
},
{
    date: '2017-05-05',
    temperature: 12.9
},
{
    date: '2017-05-06',
    temperature: 15.5
},
{
    date: '2017-05-07',
    temperature: 16.7
},
{
    date: '2017-05-08',
    temperature: 10.0
},
{
    date: '2017-05-09',
    temperature: 8.0
},
{
    date: '2017-05-10',
    temperature: 6.8
},
{
    date: '2017-05-11',
    temperature: 8.4
},
{
    date: '2017-05-12',
    temperature: 9.9
},
{
    date: '2017-05-13',
    temperature: 12.7
},
{
    date: '2017-05-14',
    temperature: 12.2
},
{
    date: '2017-05-15',
    temperature: 12.1
},
{
    date: '2017-05-16',
    temperature: 11.8
},
{
    date: '2017-05-17',
    temperature: 13.4
},
{
    date: '2017-05-18',
    temperature: 10.6
},
{
    date: '2017-05-19',
    temperature: 14.4
},
{
    date: '2017-05-20',
    temperature: 20.0
},
{
    date: '2017-05-21',
    temperature: 14.3
},
{
    date: '2017-05-22',
    temperature: 11.2
},
{
    date: '2017-05-23',
    temperature: 13.5
},
{
    date: '2017-05-24',
    temperature: 11.0
},
{
    date: '2017-05-25',
    temperature: 10.1
},
{
    date: '2017-05-26',
    temperature: 11.7
},
{
    date: '2017-05-27',
    temperature: 15.9
},
{
    date: '2017-05-28',
    temperature: 16.8
},
{
    date: '2017-05-29',
    temperature: 13.1
},
{
    date: '2017-05-30',
    temperature: 12.8
},
{
    date: '2017-05-31',
    temperature: 11.7
}];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// The function takes in a dataset and calculates how many empty tiles needed before and after the dataset is plotted.
function generateChartData(data) {

    // Calculate the starting weekday index (0-6 of the first date in the given array)
    const firstWeekday = new Date(data[0].date).getDay(),
        monthLength = data.length,
        lastElement = data[monthLength - 1].date,
        lastWeekday = new Date(lastElement).getDay(),
        lengthOfWeek = 6,
        emptyTilesFirst = firstWeekday,
        chartData = [];

    // Add the empty tiles before the first day of the month with null values to take up space in the chart
    for (let emptyDay = 0; emptyDay < emptyTilesFirst; emptyDay++) {
        chartData.push({
            x: emptyDay,
            y: 4,
            value: null,
            date: null,
            custom: {
                empty: true
            }
        });
    }

    // Loop through and populate with temperature and dates from the dataset
    for (let day = 1; day <= monthLength; day++) {
        const date = data[day - 1].date; // Get the date from the given data array
        const xCoordinate = (emptyTilesFirst + day - 1) % 7; // Offset by the number of empty tiles
        const yCoordinate = Math.floor((firstWeekday + day - 1) / 7);
        const id = day;

        // Get the corresponding temperature for the current day from the given array
        const temperature = data[day - 1].temperature;

        chartData.push({
            x: xCoordinate,
            y: 4 - yCoordinate,
            value: temperature,
            date: new Date(date).getTime(),
            custom: {
                monthDay: id
            }
        });
    }

    // Fill in the missing values when dataset is looped through.
    const emptyTilesLast = lengthOfWeek - lastWeekday;
    for (let emptyDay = 1; emptyDay <= emptyTilesLast; emptyDay++) {
        chartData.push({
            x: (lastWeekday + emptyDay) % 7,
            y: 0,
            value: null,
            date: null,
            custom: {
                empty: true
            }
        });
    }
    return chartData;
}
const chartData = generateChartData(data);

Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },

    title: {
        text: 'Mid-day temperature May 2017',
        align: 'center'
    },

    subtitle: {
        text: 'Temperature variation at mid-day through May',
        align: 'center'
    },

    accessibility: {
        landmarkVerbosity: 'one'
    },

    tooltip: {
        enabled: true,
        outside: true,
        zIndex: 20,
        format: '{#unless point.custom.empty}{point.date:%A, %b %e, %Y}{/unless}'
    },

    xAxis: {
        categories: weekdays,
        opposite: true,
        lineWidth: 55,
        lineColor: '#BBBAC5',
        labels: {
            rotation: 0,
            y: 6,
            style: {
                textTransform: 'uppercase',
                fontWeight: 'bold'
            }
        },
        accessibility: {
            description: 'weekdays',
            rangeDescription: 'X Axis is showing all 7 days of the week, starting with Sunday.'
        }
    },

    yAxis: {
        labels: {
            enabled: false
        },
        title: {
            enabled: false
        },
        min: 0,
        max: 4,
        accessibility: {
            description: 'weeks'
        }
    },

    legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle'
    },

    colorAxis: {
        min: 0,
        stops: [
            [0.2, 'lightblue'],
            [0.4, '#CBDFC8'],
            [0.6, '#F3E99E'],
            [0.9, '#F9A05C']
        ],
        labels: {
            format: '{value} °C'
        }
    },

    series: [{
        keys: ['x', 'y', 'value', 'date', 'id'],
        data: chartData,
        nullColor: 'whitesmoke',
        borderWidth: 2,
        borderColor: 'whitesmoke',
        dataLabels: [{
            enabled: true,
            format: '{#unless point.custom.empty}{point.value:.1f}°{/unless}',
            style: {
                textOutline: 'none',
                fontWeight: 'normal',
                fontSize: '1rem'
            }
        }, {
            enabled: true,
            useHTML: true,
            align: 'left',
            verticalAlign: 'top',
            format: '{#unless point.custom.empty}<p class="date">{point.custom.monthDay}</p>{/unless}'
        }]
    }]
});
