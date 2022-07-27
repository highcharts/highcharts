import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

Highcharts.chart('chart', {
    debug: true,
    chart: {
        width: 600
    },
    title: {
        text: 'Series.table study'
    },
    subtitle: {
        text: 'DataTable management'
    },
    series: [{
        type: 'line'
    }]
}, function (chart) {
    const series = chart.series[0],
        table = new DataTable({
            y: [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
            ]
        });

    series.setTable(table, true, true);

    window.setTimeout(() => {
        console.log('timeout');
        table.setRow([101]);
        series.redraw();
    }, 5000);
});
