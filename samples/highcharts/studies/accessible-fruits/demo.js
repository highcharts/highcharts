Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Total fruit consumption'
    },
    xAxis: {
        categories: ['Ted', 'Øystein', 'Marita'],
        accessibility: {
            description: 'Persons'
        }
    },
    yAxis: {
        title: {
            text: 'Fruits Eaten'
        },
        stackLabels: {
            enabled: true
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        },
        dataLabels: {
            enabled: true
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Strawberries',
        data: [3, 2, 4],
        color: '#ff5757',
        borderWidth: 2,
        borderColor: '#ffffff'
    }, {
        name: 'Mango',
        data: [1, 4, 2],
        color: '#b38f00',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Blueberries',
        data: [4, 1, 3],
        color: '#369add',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Kiwi',
        data: [2, 3, 1],
        color: '#68a14a',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Raspberries',
        data: [2, 3, 1],
        color: '#d270a9',
        borderWidth: 2,
        borderColor: '#ffffff'
    }]
});
