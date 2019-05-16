Highcharts.chart('container', {
    chart: {
        type: 'solidgauge'
    },
    title: {
        text: ''
    },
    pane: {
        startAngle: -130,
        endAngle: 130,
        background: {
            innerRadius: '50%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 2,
        minorTicks: false,
        tickWidth: 2,
        tickAmount: 2,
        labels: {
            distance: '75%',
            align: 'auto',
            style: {
                fontSize: "20px"
            }
        }
    },
    series: [{
        innerRadius: '50%',
        radius: '100%',
        dataLabels: {
            verticalAlign: 'bottom',
            style: {
                fontSize: '30px'
            }
        },
        data: [63]
    }]
});
