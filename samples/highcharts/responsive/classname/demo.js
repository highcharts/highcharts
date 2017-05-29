
var chart = Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Highcharts responsive chart'
    },

    subtitle: {
        text: 'Resize the frame to see subtitle and legend hide'
    },

    xAxis: {
        categories: ['Apples', 'Oranges', 'Bananas']
    },

    yAxis: {
        title: {
            text: 'Amount'
        }
    },

    series: [{
        name: 'Fruits',
        data: [1, 4, 3]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                chart: {
                    className: 'small-chart'
                }
            }
        }]
    }
});

$('#small').click(function () {
    chart.setSize(400, 300);
});

$('#large').click(function () {
    chart.setSize(600, 300);
});
