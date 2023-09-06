function getGradientColors() {
    return ['#7cb5ec', '#434348'].map(function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, Highcharts.color(color).brighten(-0.2).get('rgb')]
            ]
        };
    });
}

function getRandomData() {
    const data = [];

    for (let i = 0; i < Math.random() * 20; i++) {
        data.push([Math.random() * 10, Math.random() * 10]);
    }

    return data;
}

const chart = Highcharts.chart('container', {

    chart: {
        type: 'bubble',
        plotBorderWidth: 1
    },

    colors: getGradientColors(),

    title: {
        text: 'Bubble series - data sorting'
    },

    xAxis: {
        reversed: true,
        gridLineWidth: 1
    },

    plotOptions: {
        series: {
            dataSorting: {
                enabled: true,
                sortKey: 'z'
            }
        }
    },

    series: [{
        data: getRandomData()
    }, {
        data: getRandomData()
    }]

});

setInterval(function () {
    chart.series[0].setData(
        getRandomData(),
        false,
        { duration: 2000 }
    );

    chart.series[1].setData(
        getRandomData(),
        true,
        { duration: 2000 }
    );
}, 3000);
