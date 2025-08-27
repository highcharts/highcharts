const createChart = () => {
    const startAngle = document.querySelector('#start-angle').value,
        endAngle = parseInt(startAngle, 10) * -1;
    Highcharts.chart('container', {

        chart: {
            type: 'gauge',
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
            endAngle
        },

        yAxis: {
            max: 100
        },

        series: [{
            name: 'Speed',
            animation: false,
            data: [80],
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]

    });
};

createChart();

document.querySelector('#start-angle').addEventListener('input', createChart);
