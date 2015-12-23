$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            type: 'arearange'
        },

        rangeSelector: {
            enabled: false
        },

        title: {
            text: 'Reading variation'
        },

        tooltip: {
            valueSuffix: '°C'
        },

        series: [{
            id:"a",
            name: 'Temperatures',
            data: [[0,10,20], [10,13,22], [20,14,15], [30,10,21]]
        }, {
            type: 'flags',
            onSeries: "a",
            onKey: 'high',
            data:[{
                x:10,
                title: "Max"
            }]
        }]

    });
});