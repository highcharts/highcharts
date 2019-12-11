Highcharts.chart('container', {

    chart: {
        borderWidth: 1,
        borderColor: '#ccc'
    },

    title: {
        text: 'Advanced legend module rich demo'
    },

    colorAxis: [{
        min: 0,
        max: 30,
        layout: 'vertical',
        legend: 'legend-color-axis',
        id: 'color-axis'
    }],

    series: [{
        data: [4, 5, 6, 7, 1],
        legend: 'legend1'
    }, {
        data: [4, 5, 6, 7, 1],
        legend: 'legend1'
    }, {
        data: [6, 7, 1, 7, 8],
        type: 'scatter',
        legend: 'sublegend-1'
    }, {
        data: [1, 6, 8, 2, 1],
        type: 'scatter',
        legend: 'sublegend-1'
    }, {
        data: [7, 1, 7, 8, 3],
        type: 'scatter',
        legend: 'sublegend-1'
    }, {
        data: [6, 7, 1],
        type: 'column',
        legend: 'sublegend-2'
    }, {
        data: [1, 5, 3],
        type: 'column',
        legend: 'sublegend-2'
    }, {
        type: 'bubble',
        colorAxis: false,
        legend: 'legend-bubble',
        data: [{
            x: 5,
            y: 5,
            z: 13.8
        },
        {
            x: 6.5,
            y: 2.9,
            z: 14.7
        },
        {
            x: 2.8,
            y: 9.5,
            z: 15.8
        }
        ]
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
        width: '30%',
        align: 'left',
        verticalAlign: 'middle',
        sublegends: [{
            title: {
                text: 'Sublegend 1 (scatter series)'
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

    }, {
        id: 'legend-bubble',
        title: {
            text: 'Bubble legend'
        },
        y: '10%',
        layout: 'vertical',
        width: '20%',
        align: 'right',
        verticalAlign: 'top',
        bubbleLegend: {
            enabled: true
        }
    }, {
        id: 'legend-color-axis',
        align: 'right',
        symbolWidth: 10,
        verticalAlign: 'bottom',
        x: -20,
        layout: 'vertical',
        width: 60,
        title: {
            text: 'Color Axis Legend'
        }

    }]
});
