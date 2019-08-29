Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '80%'
    },
    title: {
        text: 'Simple packed bubble'
    },
    subTitle: {
        text: 'Coffee consumption'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.y}</sub>'
    },
    plotOptions: {
        packedbubble: {
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            },
            minPointSize: 5
        }
    },
    series: [{
        name: 'Coffee',
        data: [{
            value: 12,
            name: 'Bert'
        }, {
            value: 5,
            name: 'Sam'
        }, {
            value: 10,
            name: 'John'
        }, {
            value: 7,
            name: 'Dick'
        }]
    }, {
        name: 'Energy drinks',
        data: [{
            value: 10,
            name: 'Ma'
        }]
    }, {
        name: 'Tea',
        data: [5, 6, 8, {
            value: 10,
            name: 'Mustapha',
            color: 'pink'
        }]
    }]

});
