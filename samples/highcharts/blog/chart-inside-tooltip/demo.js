function renderChart(point) {
    Highcharts.chart('hc-tooltip', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Chart inside tooltip'
        },
        series: [{
            data: point.options.eData,
            dataLabels: {
                enabled: false
            }
        }]
    });
}

Highcharts.addEvent(
    Highcharts.Tooltip,
    'refresh',
    function () {
        renderChart(this.chart.hoverPoint);
    }
);

Highcharts.chart('container', {
    title: {
        text: 'Chart inside tooltip demo'
    },
    tooltip: {
        useHTML: true,
        headerFormat: '',
        pointFormat: '<div id="hc-tooltip"></div>'
    },
    series: [{
        type: 'line',
        data: [{
            y: 10,
            eData: [1, 2, 3, 4, 5]
        }, {
            y: 5,
            eData: [-10, 20, 50, 70, 20]
        }, {
            y: 2,
            eData: [103, 11, 12, 54, 68]
        }]
    }]
});
