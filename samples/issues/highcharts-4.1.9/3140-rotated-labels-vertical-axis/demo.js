$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: '#efefef',
            plotBackgroundColor: 'white'
        },

        title: {
            text: 'Rotated left axis labels should be centered and visible'
        },

        xAxis: {
            categories: ['Africa', 'America', 'As', 'Europe', 'Oceania'],
            labels: {
                rotation: -90
            }
        },

        series: [{
            name: 'Year 1800',
            animation: false,
            data: [107, 31, 635, 203, 2]
        }]
    });
});