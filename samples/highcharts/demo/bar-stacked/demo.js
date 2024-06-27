// Data retrieved from: https://www.uefa.com/uefachampionsleague/history/
Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'UEFA CL top scorers by season'
    },
    xAxis: {
        categories: [
            '2023/24', '2022/23', '2021/22', '2020/21', '2019/20', '2018/19'
        ]
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
        data: [null, null, 6, 4, 4, 6]
    }, {
        name: 'Lionel Messi',
        data: [null, 4, 5, 5, 3, 12]
    }, {
        name: 'Robert Lewandowski',
        data: [3, 5, 13, 5, 15, 8]
    }]
});
