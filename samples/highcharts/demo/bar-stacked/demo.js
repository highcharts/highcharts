// Data retrieved from: https://www.uefa.com/uefachampionsleague/history/
Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'UEFA CL top scorers by season'
    },
    xAxis: {
        categories: ['2020/21', '2019/20', '2018/19', '2017/18', '2016/17']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Goals'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Cristiano Ronaldo',
        data: [4, 4, 6, 15, 12]
    }, {
        name: 'Lionel Messi',
        data: [5, 3, 12, 6, 11]
    }, {
        name: 'Robert Lewandowski',
        data: [5, 15, 8, 5, 8]
    }]
});
