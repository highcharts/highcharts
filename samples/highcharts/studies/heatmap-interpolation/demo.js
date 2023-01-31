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

document.getElementById('interpolation-toggle').addEventListener('click', e => {
    chart.series[0].update({
        interpolation: e.target.checked
    });
});

document.getElementById('data-toggle').addEventListener('click', e => {
    chart.series[0].update(
        {
            data: e.target.checked ?
                [
                    { x: 13, y: 0, value: 1 },
                    { x: 1, y: 1, value: 20 },
                    { x: 2, y: 2, value: -28 },
                    { x: 3, y: 3, value: 18 }
                ] :
                JSON.parse(document.getElementById('data').innerText)
        }
    );
});
