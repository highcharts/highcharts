Highcharts.chart('container', {

    title: {
        text: 'Treegraph with datetime axis'
    },

    xAxis: {
        type: 'datetime',
        visible: true,
        offset: 20
    },

    tooltip: {
        pointFormat: '<b>{point.id}</b>: {point.x:%[Yeb]}'
    },

    series: [{
        type: 'treegraph',
        keys: ['id', 'parent', 'x'],
        data: [
            ['A', void 0, '2025-01-01'],
            ['B', 'A', '2025-02-01'],
            ['C', 'A', '2025-04-01'],
            ['D', 'A', '2025-03-01'],
            ['E', 'D', '2025-04-01'],
            ['F', 'D', '2025-05-01']
        ],
        dataLabels: {
            format: '{point.id}'
        }
    }]
});
