Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        borderColor: '#ccc'
    },
    title: {
        text: 'Advanced legend module basic demo'
    },
    series: [{
        data: [4, 5, 6, 7, 1],
        legend: 'legend1'
    }, {
        data: [4, 5, 6, 7, 1],
        legend: 'legend1'
    }, {
        data: [6, 7, 1, 7, 8, 9, 1, 2, 9],
        type: 'pie',
        showInLegend: true,
        legend: 'sublegend-1'
    }, {
        data: [6, 7, 1],
        type: 'column',
        legend: 'sublegend-2'
    }, {
        data: [1, 5, 3],
        type: 'column',
        legend: 'sublegend-2'
    }],
    legend: [{ // Legend 1.
        id: 'legend1',
        title: {
            text: 'Legend 1 (line series)',
            style: {
                fontSize: 18
            }
        }
    }, { // Legend 2.
        title: {
            text: 'Legend 2',
            style: {
                fontSize: 18
            }
        },
        align: 'left',
        verticalAlign: 'middle',
        sublegends: [{
            title: {
                text: 'Sublegend 1 (pie series)'
            },
            id: 'sublegend-1'
        },
        {
            title: {
                text: 'Sublegend 2 (column series)'
            },
            id: 'sublegend-2'
        }
        ]
    }]
});