const runChart = (): void => {
    const endAngle = parseInt(
            document.querySelector<HTMLInputElement>('#end-angle').value,
            10
        ),
        startAngle = endAngle * -1;

    Highcharts.chart('container', {

        chart: {
            plotBorderWidth: 1
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
            max: 100
        },

        series: [{
            name: 'Speed',
            type: 'gauge',
            animation: false,
            data: [80],
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
    });
};

runChart();

document.querySelector('#end-angle').addEventListener('input', runChart);
