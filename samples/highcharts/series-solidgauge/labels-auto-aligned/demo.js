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
        },
        plotLines: [{
            value: 35,
            zIndex: 5,
            width: 2,
            color: '#ff0000'
        }]
    },
    series: [{
        innerRadius: '50%',
        radius: '100%',
        dataLabels: {
            borderWidth: 0,
            verticalAlign: 'bottom',
            style: {
                fontSize: '30px'
            },
            y: 13
        },
        data: [63]
    }]
});
