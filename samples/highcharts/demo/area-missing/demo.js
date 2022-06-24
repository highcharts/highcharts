// Data retrieved from https://www.ssb.no/statbank/table/10467/
Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Born persons, by boys\' name'
    },
    subtitle: {
        text: '* The name Yasin was not given this year.',
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
    xAxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
    },
    yAxis: {
        title: {
            text: 'Amount'
        }
    },
    plotOptions: {
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
