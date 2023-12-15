const chart = Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },

    title: {
        text: 'Heatmap interpolation'
    },

    xAxis: {
        type: 'datetime',
        minPadding: 0,
        maxPadding: 0
    },

    yAxis: {
        endOnTick: false
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

    tooltip: {
        headerFormat: 'Temperature<br/>',
        pointFormat: '{point.x:%e %b %Y}, {point.y}:00: <b>{point.value} ℃</b>'
    },

    series: [{
        name: 'Temperature',
        colsize: 24 * 36e5, // one day
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: {
            enabled: true,
            useWebWorker: true
        }
    }]
});

document.getElementById('interpolation-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    const formObject = Object.fromEntries(formData.entries());

    chart.series[0].update({
        interpolation: {
            enabled: formObject.enabled === 'on',
            useWebWorker: formObject.useWebWorker === 'on',
            shaderCode: formObject.shaderCode
        }
    });
});
