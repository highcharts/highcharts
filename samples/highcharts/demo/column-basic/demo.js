Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Emissions to air in Norway'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.ssb.no/en/statbank/table/08940/" ' +
            'target="_blank">SSB</a>'
    },
    xAxis: {
        crosshair: {
            width: 3,
            dashStyle: 'shortdot'
        }
    },
    yAxis: {
        title: {
            useHTML: true,
            text: 'Million tonnes CO<sub>2</sub>-equivalents'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        series: {
            pointStart: 2010
        },
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Oil and gas extraction',
        data: [13.93, 13.63, 13.73, 13.67, 14.37, 14.89, 14.56,
            14.32, 14.13, 13.93, 13.21, 12.16]

    }, {
        name: 'Manufacturing industries and mining',
        data: [12.24, 12.24, 11.95, 12.02, 11.65, 11.96, 11.59,
            11.94, 11.96, 11.59, 11.42, 11.76]

    }, {
        name: 'Road traffic',
        data: [10.00, 9.93, 9.97, 10.01, 10.23, 10.26, 10.00,
            9.12, 9.36, 8.72, 8.38, 8.69]

    }, {
        name: 'Agriculture',
        data: [4.35, 4.32, 4.34, 4.39, 4.46, 4.52, 4.58, 4.55,
            4.53, 4.51, 4.49, 4.57]

    }]
});