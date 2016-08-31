$(function () {
    var chartOptions = {
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: 'Y axis minimum got stuck'
        },
        xAxis: {
            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania']
        },
        yAxis: {
            type: 'linear'
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Year 1800',
            data: [10700, 31, 635, 203, 1]
        }]
    };

    var chart = new Highcharts.Chart(chartOptions);

    chart.yAxis[0].update({ type: 'logarithmic' });
});