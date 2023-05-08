Highcharts.chart('container', {
    colors: ['#7CB5EC', '#346DA4', '#10487F'],
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: 'Top 25 Automakers by Market Cap'
    },
    subtitle: {
        text: '(In October 2020)'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value} USD b$'
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            layoutAlgorithm: {
                gravitationalConstant: 0.05,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'Europe',
        data: [{
            name: 'Volkswagen',
            value: 84.44,
            dashStyle: 'longdash'
        }, {
            name: 'Daimler',
            value: 60.89
        },
        {
            name: 'BMW',
            value: 48.60
        },
        {
            name: 'Ferrari',
            value: 45.8
        },
        {
            name: 'PSA',
            value: 16.27
        },
        {
            name: 'Renault',
            value: 7.69
        }]
    }, {
        name: 'America',
        data: [{
            name: 'Tesla',
            value: 416.19
        },
        {
            name: 'General Motors',
            value: 45.61
        },
        {
            name: 'Ford',
            value: 30.87
        },
        {
            name: 'Nokila',
            value: 9.18
        }]
    }, {
        name: 'Asia',
        data: [{
            name: 'Toyota',
            value: 184.11
        },
        {
            name: 'BYD',
            value: 51.65
        },
        {
            name: 'Honda',
            value: 41.21
        },
        {
            name: 'SAIC',
            value: 35.31
        },
        {
            name: 'Maruti Suzuki',
            value: 28.83
        },
        {
            name: 'NIO',
            value: 26.43
        },
        {
            name: 'Suziki',
            value: 22.29
        },
        {
            name: 'Geely',
            value: 21.20
        },
        {
            name: 'Subaru',
            value: 15.11
        }, {
            name: 'Xpeng',
            value: 14.88
        },
        {
            name: 'Nissan',
            value: 14.07
        },
        {
            name: 'Mahindra',
            value: 10.57
        },
        {
            name: 'Changan',
            value: 9.5
        },
        {
            name: 'FAW',
            value: 8.28
        }]
    }]
});