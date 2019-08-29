var chart = Highcharts.chart('container', {
    title: {
        text: 'Fruits'
    },
    subtitle: {
        text: 'Use buttons to change chart type'
    },
    yAxis: {
        title: {
            text: null
        }
    },
    series: [{
        type: 'line',
        data: [
            ['Apples', 3],
            ['Pears', 5],
            ['Bananas', 8],
            ['Oranges', 2]
        ],
        name: 'Fruits'
    }]
});

document.querySelectorAll('#button-row button').forEach(function (button) {
    button.addEventListener('click', function () {
        chart.series[0].update({
            type: button.className.split('-')[0]
        });
    });
});