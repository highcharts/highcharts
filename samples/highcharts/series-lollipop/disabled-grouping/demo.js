Highcharts.chart('container', {

    chart: {
        type: 'lollipop',
        inverted: true
    },

    legend: {
        enabled: false
    },

    title: {
        text: 'Lollipop series with disabled grouping'
    },

    xAxis: {
        type: 'category'
    },

    plotOptions: {
        lollipop: {
            grouping: false
        }
    },

    series: [{
        data: [{
            name: 'A',
            y: 167
        }, {
            name: 'B',
            y: 434
        }, {
            name: 'C',
            y: 254
        }]
    }, {
        data: [{
            name: 'A',
            y: 321
        }, {
            name: 'B',
            y: 132
        }, {
            name: 'C',
            y: 354
        }]
    }, {
        data: [{
            name: 'A',
            y: 90
        }, {
            name: 'B',
            y: 256
        }, {
            name: 'C',
            y: 128
        }]
    }]

});