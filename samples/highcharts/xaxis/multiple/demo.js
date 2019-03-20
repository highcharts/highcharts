Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Multiple X axes'
    },
    xAxis: [{
        categories: ["Ein", "To", "Tre", "Fire"],
        title: {
            text: 'Norwegian'
        }
    }, {
        categories: ["Uno", "Dos", "Tres", "Quatro"],
        title: {
            text: 'Spanish'
        }
    }],
    legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
    },
    series: [{
        data: [1, 2, 3, 4]
    }, {
        data: [1, 2, 3, 4],
        xAxis: 1
    }]
});