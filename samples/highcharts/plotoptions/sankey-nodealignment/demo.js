Highcharts.chart('container', {
    chart: {
        type: 'sankey'
    },
    title: {
        text: 'nodeAlignment: \'top\''
    },
    series: [{
        nodeAlignment: 'top',
        keys: ['from', 'to', 'weight'],
        data: [
            ['A1', 'B1', 1],
            ['A1', 'B2', 4],
            ['A2', 'B2', 5],
            ['A2', 'B3', 2],
            ['B2', 'C1', 6],
            ['B2', 'C2', 8],
            ['C2', 'D1', 2]
        ]
    }]
});

document.querySelectorAll('button.node-alignment').forEach(btn => {
    btn.addEventListener('click', () => {
        Highcharts.charts[0].series[0].update({
            nodeAlignment: btn.dataset.value
        });
        Highcharts.charts[0].title.update({
            text: `nodeAlignment: '${btn.dataset.value}'`
        });
    });
});

document.querySelectorAll('button.type').forEach(btn => {
    btn.addEventListener('click', () => {
        Highcharts.charts[0].update({
            chart: {
                type: btn.dataset.value
            }
        });
    });
});

document.getElementById('inverted').addEventListener('change', e => {
    Highcharts.charts[0].update({
        chart: {
            inverted: e.target.checked
        }
    }, true, true, false);
});
