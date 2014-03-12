$(function () {
    var start;
    $('#container').highcharts({
        
        data: {
            csv: document.getElementById('csv').innerHTML,
            parsed: function () {
                start = +new Date();
            }
        },

        chart: {
            type: 'heatmap',
            margin: [50, 10, 80, 50]
        },


        title: {
            text: 'Highcharts heat map study',
            align: 'left'
        },

        subtitle: {
            text: 'Temperature variation by day and hour through 2013',
            align: 'left'
        },

        xAxis: {
            min: Date.UTC(2013, 0, 1),
            max: Date.UTC(2014, 0, 1)
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
            max: 23,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ],
            min: -15,
            max: 25,
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // one day
            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
            }
        }]

    });
    console.log('Rendered in ' + (new Date() - start) + ' ms');

});