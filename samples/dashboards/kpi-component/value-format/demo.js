Dashboards.board('container', {
    components: [{
        renderTo: 'kpi-00',
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
                innerSize: '60%',
                borderRadius: '50%'
            },
            yAxis: {
                min: 0,
                max: 300
            },
            series: [{
                dataLabels: {
                    enabled: false
                },
                data: [{}]
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
