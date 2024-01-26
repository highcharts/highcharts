Dashboards.board('container', {
    components: [{
        cell: 'kpi-00',
        type: 'KPI',
        title: 'Speed',
        value: 200,
        valueFormat: '{value} km/h',
        chartOptions: {
            chart: {
                type: 'solidgauge'
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: {
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            yAxis: {
                min: 0,
                max: 300
            },
            series: [{
                dataLabels: {
                    enabled: false
                },
                rounded: true,
                data: [{
                    innerRadius: '60%',
                    outerRadius: '100%'
                }]
            }]
        }
    }],
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'kpi-00'
                }]
            }]
        }]
    }
});
