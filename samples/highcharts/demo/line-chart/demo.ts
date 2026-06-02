Highcharts.chart('container', {
    title: {
        align: 'left',
        text: 'U.S Solar Employment Growth'
    },
    subtitle: {
        align: 'left',
        text: 'By Job Category. Source: <a ' +
               'href="https://irecusa.org/programs/solar-jobs-census/" ' +
               'target="_blank">IREC</a>.'
    },
    xAxis: {
        accessibility: {
            rangeDescription: 'Range: 2010 to 2022'
        }
    },
    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },
    legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle'
    },
    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },
    responsive: {
        rules: [{
            chartOptions: {
                legend: {
                    align: 'center',
                    layout: 'horizontal',
                    verticalAlign: 'bottom'
                }
            },
            condition: {
                maxWidth: 500
            }
        }]
    },
    series: [{
        data: [
            43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
            161454, 154610, 168960, 171558
        ],
        name: 'Installation & Developers'
    }, {
        data: [
            24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
            34243, 31050, 33099, 33473
        ],
        name: 'Manufacturing'
    }, {
        data: [
            11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
            29213, 25663, 28978, 30618
        ],
        name: 'Sales & Distribution'
    }, {
        data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            11164,
            11218,
            10077,
            12530,
            16585
        ],
        name: 'Operations & Maintenance'
    }, {
        data: [
            21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
            10073, 11471, 11648
        ],
        name: 'Other'
    }]
});
