Highcharts.chart('container', {
    chart: {
        type: 'column',
        plotBorderWidth: 1
    },
    title: {
        text: '年各种食品中氚活度浓度年报'
    },
    credits: {
        enabled: false
    },
    xAxis: {
        categories: ['大米', '叶菜', '松针'],

        lineWidth: 1,
        crosshair: true,
        tickWidth: 0
    },
    yAxis: {
        min: 1,
        type: 'logarithmic',
        tickInterval: 1,
        gridLineDashStyle: 'LongDash',
        gridLineColor: '#aaa',
        max: 1000,
        title: {
            text: '生物中氚活度浓度(Bq/kg·鲜)'
        }
    },

    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 2011,
        data: [2.25, 3.3, 26.3]
    }, {
        name: 2012,
        data: [1.55, 9.35, 16]
    }, {
        name: 2013,
        data: [2.05, 3.8, 10.9]
    }, {
        name: 2014,
        data: [2.3, 12.35, 32.25]
    }, {
        name: 2015,
        data: [4.05, 5.75, 17.25]
    }]
});
