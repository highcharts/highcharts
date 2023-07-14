const chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    xAxis: {
        type: 'category'
    },
    title: {
        text: 'Breadcrumbs in RTL'
    },
    series: [{
        name: 'Supply',
        data: [{
            name: 'Fruits',
            y: 5,
            drilldown: 'Fruits'
        },
        {
            name: 'Vegetables',
            y: 6
        },
        {
            name: 'Meat',
            y: 3
        }
        ]
    }],
    drilldown: {
        breadcrumbs: {
            rtl: true,
            position: {
                align: 'right'
            }
        },
        series: [{
            name: 'Fruits',
            id: 'Fruits',
            data: [{
                name: 'Citrus',
                y: 2
            }, {
                name: 'Tropical',
                y: 5
            },
            ['Other', 1]
            ]
        }]
    }
});

// activate the button
document.getElementById('button').addEventListener('click', e => {
    chart.series[0].points[0].doDrilldown();

    e.target.disabled = true;
});