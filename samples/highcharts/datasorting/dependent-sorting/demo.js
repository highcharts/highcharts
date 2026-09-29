const names = [
    'Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon',
    'Anna', 'Tim', 'Laura'
];

function getRandomData(row) {
    const data = [];

    for (let i = 0; i < 10; i++) {
        if (!row) {
            data.push([names[i], row, Math.random() * 30 + 10]);
        } else {
            data.push([row, Math.random() * 10]);
        }
    }
    return data;
}

const chart = Highcharts.chart('container', {

    chart: {
        type: 'heatmap',
        plotBorderWidth: 1
    },

    title: {
        text: 'Dependent sorting - Heatmap'
    },

    xAxis: {
        type: 'category',
        labels: {
            animate: true
        }
    },

    yAxis: {
        categories: ['Total', 'Tuesday', 'Wednesday', 'Thursday'],
        title: null
    },

    colorAxis: [{
        min: 0,
        max: 40,
        visible: false,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    }, {
        min: 0,
        max: 10,
        visible: false,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[1]
    }, {
        min: 0,
        max: 10,
        visible: false,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[2]
    }, {
        min: 0,
        max: 10,
        visible: false,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[3]
    }],

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                format: '{value:.1f}'
            }
        }
    },

    series: [{
        borderWidth: 1,
        id: 'mainSeries',
        keys: ['name', 'y', 'value'],
        dataSorting: {
            enabled: true,
            sortKey: 'value'
        },
        data: getRandomData(0)
    }, {
        borderWidth: 1,
        linkedTo: 'mainSeries',
        data: getRandomData(1),
        keys: ['y', 'value'],
        colorAxis: 1
    }, {
        borderWidth: 1,
        linkedTo: 'mainSeries',
        data: getRandomData(2),
        keys: ['y', 'value'],
        colorAxis: 2
    }, {
        borderWidth: 1,
        linkedTo: 'mainSeries',
        data: getRandomData(3),
        keys: ['y', 'value'],
        colorAxis: 3
    }]

});

setInterval(function () {
    chart.update({
        series: [{
            data: getRandomData(0)
        }, {
            data: getRandomData(1)
        }, {
            data: getRandomData(2)
        }, {
            data: getRandomData(3)
        }]
    }, true, false, { duration: 2000 });
}, 3000);
