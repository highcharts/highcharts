$(function () {

    var chart = $('#container').highcharts({

        chart: {
            plotBackgroundColor: '#E0FFFF',
            marginLeft: 100
        },
        title: {
            text: ''
        },

        legend: {
            enabled: false
        },

        xAxis: {
            type: "datetime",
            min: Date.UTC(2014, 4, 1),
            max: Date.UTC(2014, 4, 31),
            ordinal: false
        },

        scrollbar: {
            enabled: true
        },


        yAxis: [{

            title: {
                text: 'Values',
                margin: 16
            },
            min: 0,
            lineWidth: 1,
            gridLineWidth: 0,
            labels: {
                format: '{value}',
                style: {
                    color: '#000000'
                }
            }

        }],

        series: [{
            name: 'blue',
            color: '#0000FF',
            data: [1,4,3,4,5,5,4,34,23,2,3,3,4,45,5,6],
            pointStart: Date.UTC(2014, 4, 5),
            pointInterval: 24 * 36e5
        }]
    }).highcharts();

    $('#left').click(function () {
        chart.xAxis[0].setExtremes(Date.UTC(2014, 4, 1), Date.UTC(2014, 4, 4), true, false);
    });

    $('#right').click(function () {
        chart.xAxis[0].setExtremes(Date.UTC(2014, 4, 20), Date.UTC(2014, 4, 25), true, false);
    });

    $('#on').click(function () {
        chart.xAxis[0].setExtremes(Date.UTC(2014, 4, 1), Date.UTC(2014, 4, 7), true, false);
    });
});