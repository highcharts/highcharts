function getRandomData() {
    var data = [];

    for (var i = 0; i < 15; i++) {
        data.push(Math.random() * 14);
    }

    return data;
}

var chart = Highcharts.chart({
    chart: {
        renderTo: 'container',
        type: 'column',
        polar: true
    },
    title: {
        text: 'Radial chart - sorting'
    },
    colorAxis: {
        layout: 'vertical',
        max: 15,
        stops: [
            [0, '#3060cf'],
            [0.8, '#fffbbc'],
            [0.95, '#c4463a']
        ]
    },
    legend: {
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        dataSorting: {
            enabled: true
        },
        data: getRandomData()
    }, {
        colorAxis: false,
        type: 'scatter',
        showInLegend: false,
        marker: {
            radius: 2
        },
        dataSorting: {
            enabled: true
        },
        data: getRandomData()
    }]
});

setInterval(function () {
    chart.series[0].setData(
        getRandomData(),
        false,
        { duration: 1500 }
    );

    chart.series[1].setData(
        getRandomData(),
        true,
        { duration: 1500 }
    );
}, 2000);
