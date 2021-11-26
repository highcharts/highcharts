const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    series: [{
        data: [1, 11, 209, 0.2],
        type: 'column'
    }]
});

let isLogarithmic = false;
document.getElementById('linlog').addEventListener('click', () => {
    chart.yAxis[0].update({
        type: isLogarithmic ? 'linear' : 'logarithmic'
    });
    isLogarithmic = !isLogarithmic;
});
