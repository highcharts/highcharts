
Highcharts.chart('container', {

    chart: {
        type: 'bar'
    },

    title: {
        text: 'Multiple datalabels per point'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                inside: true
            }
        }
    },

    xAxis: {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0
    },

    yAxis: {
        title: {
            text: ''
        }
    },

    series: [{
        dataLabels: [{
            align: 'left',
            format: '({point.age})'
        }, {
            align: 'right',
            format: '{y} points'
        }],
        data: [{
            y: 123,
            name: 'Gabriel',
            age: 12,
            dataLabels: {
                color: 'red'
            }
        }, {
            y: 121,
            name: 'Marie',
            age: 14,
            group: ''
        }, {
            y: 111,
            name: 'Adam',
            age: 13
        }, {
            y: 127,
            name: 'Camille',
            age: 11
        }, {
            y: 116,
            name: 'Paul',
            age: 12
        }, {
            y: 119,
            name: 'Laura',
            age: 14
        }, {
            y: 124,
            name: 'Louis',
            age: 14
        }],
        showInLegend: false
    }]

});
