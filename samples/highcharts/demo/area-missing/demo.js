// Data retrieved from https://www.ssb.no/statbank/table/10467/
Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Born persons, by boys\' name'
    },
    subtitle: {
        text: '* Missing data for Yasin in 2019',
        align: 'right',
        verticalAlign: 'bottom'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 60,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    yAxis: {
        title: {
            text: 'Amount'
        }
    },
    plotOptions: {
        series: {
            pointStart: 2014
        },
        area: {
            fillOpacity: 0.5
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Arvid',
        data: [10, 9, 11, 11, 8, 13, 12, 14]
    }, {
        name: 'Yasin',
        data: [13, 9, 10, 10, 8, null, 8, 6]
    }]
});
