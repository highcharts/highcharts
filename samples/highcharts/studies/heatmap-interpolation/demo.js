Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },

    title: {
        text: 'Highcharts interpolation studies'
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
        data: JSON.parse(document.getElementById('data').innerText)
    }]
});