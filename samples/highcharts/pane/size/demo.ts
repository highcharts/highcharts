const runChart = (): void => {
    const endAngle = parseInt(
            document.querySelector<HTMLInputElement>('#end-angle').value,
            10
        ),
        startAngle = endAngle * -1;

    Highcharts.chart('container', {

        chart: {
            plotBorderWidth: 1,
            polar: true
        },

        title: {
            text: 'Responsive pane size'
        },

        subtitle: {
            text: `startAngle: ${startAngle}, endAngle: ${endAngle}`
        },
        pane: {
            startAngle,
            endAngle,
            background: [{
                outerRadius: '100%',
                innerRadius: '70%',
                shape: 'arc'
            }],
            size: undefined,
            center: ['50%', undefined]
        },

        yAxis: {
            min: 0,
            max: 100,
            labels: {
                distance: 15
            }
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            name: 'Speed',
            type: 'gauge',
            data: [80],
            dataLabels: {
                borderWidth: 0,
                style: {
                    fontSize: '1.4em'
                },
                y: 25
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
    });
};

runChart();

document.querySelector('#end-angle').addEventListener('input', runChart);
