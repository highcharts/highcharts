Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Earth\'s atmosphere'
    },
    subtitle: {
        text:
      'Source: <a href="https://www.nasa.gov/mission_pages/sunearth/science/atmosphere-layers2.html">nasa.gov</a>'
    },
    xAxis: {
        categories: ['Earth\'s atmosphere'],
        visible: false
    },
    yAxis: {
        labels: {
            enabled: false
        },
        visible: false,
        min: 0,
        title: {
            text: null
        }
    },
    tooltip: {
        headerFormat: null,
        pointFormat: '{point.series.options.custom.info}'
    },
    plotOptions: {
        column: {
            stacking: 'percent',
            borderColor: 'black',
            borderWidth: 4,
            color: 'white',
            dataLabels: {
                enabled: true,
                format: '{series.name}: {point.series.options.custom.height}',
                color: 'black',
                style: {
                    textOutline: false
                }
            }
        }
    },
    legend: {
        enabled: false
    },
    series: [
        {
            name: 'Exosphere',
            data: [1],
            custom: {
                height: 'up to 10.000km',
                info:
        'This is the upper limit of our atmosphere.<br> It extends from the top of the thermosphere up to 10,000 km (6,200 mi).'
            }
        },
        {
            name: 'Ionosphere',
            data: [1],
            custom: {
                height: '48km',
                info:
        '<b>The ionosphere</b> is an abundant layer of electrons and ionized atoms and molecules <br> that stretches from about 48 kilometers (30 miles) above <br>  the surface to the edge of space at about 965 km (600 mi)'
            }
        },
        {
            name: 'Thermosphere',
            data: [1],
            custom: {
                height: '600km',
                info:
        '<b>The thermosphere</b>  starts just above the mesosphere <br>  and extends to 600 kilometers (372 miles) high'
            }
        },
        {
            name: 'Mesosphere',
            data: [1],
            custom: {
                height: '85m',
                info:
        '<b>The mesosphere</b>  starts just above the stratosphere <br>  and extends to 85 kilometers (53 miles) high'
            }
        },
        {
            name: 'Stratosphere',
            data: [1],
            custom: {
                height: '50km',
                info:
        '<b>The stratosphere</b>  starts just above the troposphere <br>  and extends to 50 kilometers (31 miles) high'
            }
        },
        {
            name: 'Troposphere',
            data: [1],
            custom: {
                height: '8 to 14.5km',
                info:
        '<b>The troposphere </b>starts at the Earth\'s surface <br>  and extends 8 to 14.5 kilometers high (5 to 9 miles)'
            }
        }
    ]
});
