// Custom template helper
Highcharts.Templating.helpers.abs = value => Math.abs(value);

// Age categories
const categories = [
    '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-40', '40-45',
    '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
];

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Population pyramid for Somalia, 2021',
        align: 'left'
    },
    subtitle: {
        text: 'Source: <a ' +
            'href="https://countryeconomy.com/demography/population-structure/somalia"' +
            'target="_blank">countryeconomy.com</a>',
        align: 'left'
    },
    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
        }
    },
    xAxis: [{
        categories: categories,
        reversed: false,
        labels: {
            step: 1
        },
        accessibility: {
            description: 'Age (male)'
        }
    }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
            step: 1
        },
        accessibility: {
            description: 'Age (female)'
        }
    }],
    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{abs value}%'
        },
        accessibility: {
            description: 'Percentage population',
            rangeDescription: 'Range: 0 to 5%'
        }
    },

    plotOptions: {
        series: {
            stacking: 'normal',
            borderRadius: '50%'
        }
    },

    tooltip: {
        format: '<b>{series.name}, age {point.category}</b><br/>' +
            'Population: {(abs point.y):.1f}%'
    },

    series: [{
        name: 'Male',
        data: [
            -8.98, -7.52, -6.65, -5.72, -4.85,
            -3.71, -2.76, -2.07, -1.70, -1.47,
            -1.22, -0.99, -0.81, -0.62, -0.41,
            -0.23, -0.15
        ]
    }, {
        name: 'Female',
        data: [
            8.84, 7.42, 6.57, 5.68, 4.83,
            3.74, 2.80, 2.14, 1.79, 1.59,
            1.34, 1.06, 0.83, 0.63, 0.43,
            0.25, 0.19
        ]
    }]
});
