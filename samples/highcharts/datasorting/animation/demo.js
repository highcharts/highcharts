Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map(function (color) {
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
    })
});

function getRandomData() {
    const data = [];

    for (let i = 0; i < 50; i++) {
        data.push([Math.random() * 14, Math.random() * 14]);
    }

    return data;
}

// Set up the chart
const chart = Highcharts.chart({
    chart: {
        renderTo: 'container',
        margin: 100,
        type: 'scatter3d',
        animation: false,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 40,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false
        }
    },
    title: {
        text: 'Scatter-3d - data sorting'
    },
    plotOptions: {
        scatter: {
            width: 20,
            height: 20,
            depth: 20
        }
    },
    yAxis: {
        min: 0,
        max: 15,
        title: null
    },
    xAxis: {
        min: 0,
        max: 50,
        gridLineWidth: 1
    },
    zAxis: {
        min: 0,
        max: 15,
        showFirstLabel: false
    },
    legend: {
        enabled: false
    },
    series: [{
        keys: ['y', 'z'],
        dataSorting: {
            enabled: true,
            sortKey: 'y'
        },
        colorByPoint: true,
        data: getRandomData()
    }]
});

setInterval(function () {
    chart.series[0].setData(getRandomData(), true, { duration: 1000 });
}, 1500);
