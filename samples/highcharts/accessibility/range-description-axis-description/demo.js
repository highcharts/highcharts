Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Daily Steps Count'
    },
    xAxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        accessibility: {
            description: 'Day of the week'
        }
    },
    yAxis: {
        title: {
            text: 'Steps'
        },
        accessibility: {
            description: 'Daily steps in total for all three persons',
            rangeDescription: 'Ranges from 22214 steps to 33730 steps'
        },
        stackLabels: {
            enabled: true
        }
    },
    tooltip: {
        valueSuffix: ' steps'
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'Emma',
        data: [9438, 10439, 11023, 13204, 10392, 9201, 12039],
        color: '#009AFA',
        accessibility: {
            description: 'Emma walked the most in total during the week with ' +
            '75739 steps.'
        }
    }, {
        name: 'John',
        data: [10200, 6243, 9472, 6311, 7901, 11320, 8032],
        color: '#3A3691'
    }, {
        name: 'Alex',
        data: [9029, 5532, 7632, 10320, 6210, 13209, 3052],
        color: '#00A855',
        accessibility: {
            description: 'Alex had the highest number of steps in a day ' +
                'during the week on Saturday. He walked 13209 steps that day.'
        }
    }]
});
