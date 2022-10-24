// Data gathered from http://populationpyramid.net/germany/2015/

// Age categories
var categories = [
    '0-4', '5-9', '10-14', '15-19',
    '20-24', '25-29', '30-34', '35-39', '40-44',
    '45-49', '50-54', '55-59', '60-64', '65-69',
    '70-74', '75-79', '80-84', '85-89', '90-94',
    '95-99', '100 + '
];

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    colorAxis: [{
        maxColor: '#000fb0',
        minColor: '#e3e5ff',
        labels: {
            format: '{value}%'
        },
        reversed: true
    }, {
        minColor: '#ffece8',
        maxColor: '#8a1900',
        labels: {
            format: '{value}%'
        }
    }],
    title: {
        text: 'Population pyramid for Germany, 2018'
    },
    subtitle: {
        text: 'Source: <a href="http://populationpyramid.net/germany/2018/">Population Pyramids of the World from 1950 to 2100</a>'
    },
    xAxis: [{
        categories,
        reversed: false,
        labels: {
            step: 1
        }
    }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
            step: 1
        }
    }],
    yAxis: [{
        title: {
            text: null
        },
        labels: {
            format: '{value}%'
        },
        reversed: true,
        width: '50%'
    }, {
        title: {
            text: null
        },
        labels: {
            format: '{value}%'
        },
        left: '50%',
        offset: 0,
        showFirstLabel: false,
        width: '50%'
    }],

    tooltip: {
        valueSuffix: '%'
    },

    series: [{
        name: 'Male',
        data: [
            2.2, 2.1, 2.2, 2.4,
            2.7, 3.0, 3.3, 3.2,
            2.9, 3.5, 4.4, 4.1,
            3.4, 2.7, 2.3, 2.2,
            1.6, 0.6, 0.3, 0.0,
            0.0
        ]
    }, {
        name: 'Female',
        colorAxis: 1,
        data: [
            2.1, 2.0, 2.1, 2.3, 2.6,
            2.9, 3.2, 3.1, 2.9, 3.4,
            4.3, 4.0, 3.5, 2.9, 2.5,
            2.7, 2.2, 1.1, 0.6, 0.2,
            0.0
        ],
        yAxis: 1
    }]
});
