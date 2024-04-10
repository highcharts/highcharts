Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 25
    },
    title: {
        text: 'Updating points'
    },
    colorAxis: {
        minColor: '#90ed7d'
    },
    xAxis: {
        tickInterval: 1,
        labels: {
            y: 12
        }
    },
    yAxis: {
        min: 0,
        max: 10,
        tickInterval: 1
    },
    series: [{
        pointPadding: 0,
        groupPadding: 0,
        pointPlacement: 'between',
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }]
}, function () {
    const chart = this,
        series = chart.series[0],
        newData = [];

    let numberOfPoints;

    setInterval(function () {
        numberOfPoints = series.points.length;
        while (numberOfPoints--) {
            newData.push(Math.round(Math.random() * 10));
        }
        series.update({
            data: newData
        });
        newData.length = 0;
    }, 1000);
});