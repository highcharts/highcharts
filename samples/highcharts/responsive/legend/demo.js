
var chart = Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Highcharts responsive chart'
    },

    subtitle: {
        text: 'Resize the frame to see the legend position change'
    },

    legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
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
        name: 'Christmas Eve',
        data: [1, 4, 3]
    }, {
        name: 'Christmas Day before dinner',
        data: [6, 4, 2]
    }, {
        name: 'Christmas Day after dinner',
        data: [8, 4, 3]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
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
