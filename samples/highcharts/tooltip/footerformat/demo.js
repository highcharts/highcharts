Highcharts.chart('container', {

    title: {
        text: 'Tooltip footer format demo'
    },

    subtitle: {
        text: 'The tooltip should provide a HTML table where the table is closed in the footerFormat'
    },

    xAxis: {
        type: 'datetime'
    },

    tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
        pointFormat: '<tr><td style="color: {series.color}">{series.name} </td>' +
            '<td style="text-align: right"><b>{point.y} EUR</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 2
    },

    plotOptions: {
        series: {
            pointStart: Date.UTC(2021, 0, 1),
            pointIntervalUnit: 'month'
        }
    },

    series: [{
        name: 'Short',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }, {
        name: 'Long named series',
        data: [106.4, 171.5, 129.9, 154.4, 195.6, 194.1, 216.4, 148.5, 135.6,
            176, 144, 129.2]
    }]

});