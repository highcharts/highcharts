import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const chart = Highcharts.chart('chart', {
    debug: true,
    chart: {
        width: 600
    },
    title: {
        text: 'Series.table study'
    },
    subtitle: {
        text: 'DataTable management'
    }
});

function addSeries(e) {
    if (chart.series[0]) {
        chart.series[0].remove();
    }

    const series = chart.addSeries({
            type: e.target.innerText.toLowerCase()
        }),
        table = new DataTable({
            y: [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
                43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
            ]
        });

    series.setTable(table, true, true);

    window.setTimeout(() => {
        table.setRow([101]);
        series.redraw();
    }, 2000);

    window.setTimeout(() => {
        table.deleteRows(0, 1);
        series.redraw();
    }, 4000);

    window.setTimeout(() => {
        table.deleteRows(16, 1);
        series.redraw();
    }, 6000);
}

document
    .getElementById('line')
    .addEventListener('click', addSeries);

document
    .getElementById('column')
    .addEventListener('click', addSeries);

document
    .getElementById('pie')
    .addEventListener('click', addSeries);

document
    .getElementById('benchmarkSetData')
    .addEventListener('click', () => {
    });

document
    .getElementById('benchmarkSetTable')
    .addEventListener('click', () => {
    });
