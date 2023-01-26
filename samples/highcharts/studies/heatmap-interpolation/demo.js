const chart = Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },

    title: {
        text: 'Highcharts interpolation study'
    },

    xAxis: {
        type: 'datetime'
    },

    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ],
        min: -5,
        max: 25
    },

    series: [{
        interpolation: true,
        colsize: 24 * 36e5, // one day
        data: JSON.parse(document.getElementById('data').innerText),
        _data: [
            [0, 0, -5],
            [0, 1, 0],
            [1, 0, 5],
            [1, 1, 10]
        ]
    }]
});

console.log(chart.series[0]);

document.getElementById('interpolation-toggle').addEventListener('click', e => {
    chart.series[0].update({
        interpolation: e.target.checked
    });
});
