import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import '../../../../code/es-modules/Data/Series/DataSeries.js';

Highcharts.chart('chart', {
    title: {
        text: 'DataSeries study'
    },
    subtitle: {
        text: 'DataTable management'
    },
    series: [{
        type: 'data',
        data: [1, 2, 3]
    }]
}, function (chart) {
    const table = chart.series[0].table;
    window.setInterval(function () {
        table.getRow(Math.floor(Math.random() * 3)).updateCell('y', Math.random() * 10);
    }, 3000);
});
