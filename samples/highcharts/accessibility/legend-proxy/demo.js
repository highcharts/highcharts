Highcharts.chart('container', {
    chart: {
        type: 'line',
        aninmation: false
    },
    title: {
        text: 'Sample Line Chart'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    yAxis: {
        title: {
            text: 'Values'
        }
    },
    plotOptions: {
        series: {
            animation: false
        }
    },
    series: [{
        name: 'Series 1 - Test version',
        data: [1, 3, 2, 4, 5]
    }, {
        name: 'Series 2 - Test version',
        data: [2, 2, 3, 5, 4]
    }, {
        name: 'Series 3 - Test version',
        data: [2, 12, 3, 15, 24]
    }, {
        name: 'Series 4 - Test version',
        data: [2, 2, 13, 5, 14]
    }, {
        name: 'Series 5 - Test version',
        data: [2, 2, 3, 25, 4]
    }, {
        name: 'Series 6 - Test version',
        data: [2, 2, 3, 5, 14]
    }, {
        name: 'Series 7 - Test version',
        data: [2, 22, 3, 5, 4]
    }, {
        name: 'Series 8 - Test version',
        data: [12, 2, 13, 5, 4]
    }, {
        name: 'Series 9 - Test version',
        data: [22, 2, 3, 5, 4]
    }, {
        name: 'Series 10 - Test version',
        data: [12, 2, 3, 5, 4]
    }]
}, () => {
    setTimeout(
        () => window.scrollTo(0, document.body.scrollHeight),
        50
    );
});