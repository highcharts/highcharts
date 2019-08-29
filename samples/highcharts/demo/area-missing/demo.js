Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Fruit consumption *'
    },
    subtitle: {
        text: '* Jane\'s banana consumption is unknown',
        align: 'right',
        verticalAlign: 'bottom'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries']
    },
    yAxis: {
        title: {
            text: 'Y-Axis'
        }
    },
    plotOptions: {
        area: {
            fillOpacity: 0.5
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'John',
        data: [0, 1, 4, 4, 5, 2, 3, 7]
    }, {
        name: 'Jane',
        data: [1, 0, 3, null, 3, 1, 2, 1]
    }]
});