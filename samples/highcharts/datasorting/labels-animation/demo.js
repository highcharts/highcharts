var names = ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura'];

function getRandomData() {
    var data = [];

    for (var i = 0; i < 10; i++) {
        data.push([names[i], Math.random() * 10]);
    }

    return data;
}

var chart = Highcharts.chart('container', {

    chart: {
        type: 'bar',
        marginLeft: 100
    },

    title: {
        text: 'Bar series - data sorting'
    },

    yAxis: {
        title: {
            text: ''
        }
    },

    xAxis: {
        type: 'category',
        min: 0,
        labels: {
            animate: true
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        zoneAxis: 'x',
        zones: [{
            value: 1,
            color: '#ff4d40'
        }],
        dataLabels: {
            enabled: true,
            format: '{y:,.2f}'
        },
        dataSorting: {
            enabled: true,
            sortKey: 'y'
        },
        data: getRandomData()
    }]

});

setInterval(function () {
    chart.series[0].setData(
        getRandomData(),
        true,
        { duration: 2000 }
    );
}, 3000);
