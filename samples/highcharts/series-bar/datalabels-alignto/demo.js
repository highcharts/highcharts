Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Data labels aligned to plot edges'
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges', 'Carrots']
    },
    yAxis: {
        title: {
            text: null
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Fruit consumption',
        data: [112, 2345, 3245, 6321, 6870],
        dataLabels: {
            align: 'right',
            alignTo: 'plotEdges',
            enabled: true
        },
        colorByPoint: true
    }]
});