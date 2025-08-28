const runChart = (): void => {
    const endAngle = parseInt(
            document.querySelector<HTMLInputElement>('#end-angle').value,
            10
        ),
        startAngle = endAngle * -1;

    Highcharts.chart('container', {

        chart: {
            plotBorderWidth: 1,
            width: parseInt(
                document.querySelector<HTMLInputElement>('#chart-width').value,
                10
            ),
            height: parseInt(
                document.querySelector<HTMLInputElement>('#chart-height').value,
                10
            )
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
                innerRadius: '60%',
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
            },
            gauge: {
                dataLabels: {
                    y: 25
                }
            },
            solidgauge: {
                dataLabels: {
                    verticalAlign: 'middle'
                }
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
                backgroundColor: '#ddd8'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
    });
};

runChart();

document.querySelectorAll('input[type="range"]').forEach(
    input => input.addEventListener('input', runChart)
);
