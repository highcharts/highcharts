import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import '../../../../code/es-modules/Data/Series/DataSeries.js';

Highcharts.chart('chart', {
    debug: true,
    chart: {
        width: 600
    },
    title: {
        text: 'DataSeries study'
    },
    subtitle: {
        text: 'DataTable management'
    },
    series: [{
        type: 'data',
        data: (new Array(50))
    }]
}, function (chart) {
    const series = chart.series[0],
        table = series.table,
        tableRowCount = table.getRowCount();
    /*window.setInterval(function () {
        table.getRow(Math.floor(Math.random() * tableRowCount)).setCell('y', Math.random() * 30);
    }, 1000);*/
    window.setInterval(function () {
        series.update({
            data: [Math.random() * 30]
        });
    }, 10000);
});
