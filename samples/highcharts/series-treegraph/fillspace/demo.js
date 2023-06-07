Highcharts.chart('container1', {

    title: {
        useHTML: true,
        text: `Treegraph series with the <span class="backticks-true">
        fillSpace: true</span> option.`
    },

    subtitle: {
        text: 'Note that the "B" node is initially collapsed!'
    },

    series: [{
        fillSpace: true,
        marker: {
            radius: 30
        },
        type: 'treegraph',
        keys: ['id', 'parent', 'collapsed'],
        data: [
            ['A'],
            ['B', 'A', true],
            ['C', 'B'],
            ['E', 'B'],
            ['D', 'A'],
            ['F', 'E'],
            ['G', 'E']
        ],
        dataLabels: {
            format: '{point.id}'
        }
    }]

});

Highcharts.chart('container2', {

    title: {
        useHTML: true,
        text: `Treegraph series with the <span class="backticks-false">
        fillSpace: false</span> option.`
    },

    subtitle: {
        text: 'Note that the "B" node is initially collapsed!'
    },

    series: [{
        fillSpace: false,
        marker: {
            radius: 30
        },
        type: 'treegraph',
        keys: ['id', 'parent', 'collapsed'],
        data: [
            ['A'],
            ['B', 'A', true],
            ['C', 'B'],
            ['E', 'B'],
            ['D', 'A'],
            ['F', 'E'],
            ['G', 'E']
        ],
        dataLabels: {
            format: '{point.id}'
        }
    }]

});

document.querySelectorAll('.toggle-collapse-node').forEach(btn => {
    const pointIndex = btn.dataset.value;
    btn.addEventListener('click', () => {
        Highcharts.charts.forEach(chart => {
            chart.series[0].points[pointIndex].update({
                collapsed: !chart.series[0].points[pointIndex].options.collapsed
            });
        });
    });
});
