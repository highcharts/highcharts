$(function () {

    $('#container').highcharts({

        data: {
            csv: document.getElementById('csv').innerHTML
        },

        chart: {
            type: 'heatmap',
            inverted: true
        },


        title: {
            text: 'Highcharts heat map',
            align: 'left'
        },

        subtitle: {
            text: 'Temperature variation by day and hour through May 2015',
            align: 'left'
        },

        xAxis: {
            tickPixelInterval: 50,
            min: Date.UTC(2015, 4, 1),
            max: Date.UTC(2015, 4, 30)
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}:00'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 6, 12, 18, 24],
            tickWidth: 1,
            min: 0,
            max: 23
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ],
            min: -5
        },

        series: [{
            borderWidth: 0,
            colsize: 24 * 36e5, // one day
            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
            }
        }]

    });
});