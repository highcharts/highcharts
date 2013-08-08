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
            text: 'Highcharts heat map study',
            align: 'left'
        },

        subtitle: {
            text: 'Temperature variation by day and hour through April 2013',
            align: 'left'
        },

        xAxis: {
            tickPixelInterval: 50
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
            tickWidth: 1
        },

        series: [{
            borderWidth: 0,
            colsize: 24 * 36e5, // one day

            colorRange: {
                from: '#000088',
                to: '#FFDDAA',
                fromLabel: 'Cold',
                toLabel: 'Warm'
            },

            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.z} ℃</b>'
            }
        }]

    });
});