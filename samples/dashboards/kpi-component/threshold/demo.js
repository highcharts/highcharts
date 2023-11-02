const speed = 200,
    speedLimit = 150;

const board = Dashboards.board('container', {
    components: [{
        cell: 'kpi-00',
        type: 'KPI',
        title: 'Speed',
        value: speed,
        valueFormat: '{value} km/h',
        threshold: speedLimit,
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
                animation: {
                    duration: 900
                },
                rounded: true,
                data: [{
                    y: speed,
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

function updateSpeed() {
    const element = board.mountedComponents[0],
        chart = element.component.chart,
        oldSpeed = chart.series[0].data[0].y;
    let newSpeed = oldSpeed - 50;
    if (oldSpeed <= 0) {
        newSpeed = 300;
    }

    chart.series[0].setData([newSpeed]);

    element.component.update({
        value: newSpeed
    });
}

setInterval(() => {
    updateSpeed();
}, 1000);
