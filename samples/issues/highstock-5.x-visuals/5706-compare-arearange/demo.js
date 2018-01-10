//console.clear();
$(function () {
    var data = [
        [1393635600000, 134.0, 134.0],
        [1393722000000, 135.0, 190.0],
        [1393808400000, 153.0, 158.0],
        [1393894800000, 173.0, 179.0],
        [1393981200000, 110.0, 113.0],
        [1394067600000, 119.0, 153.0],
        [1394154000000, 144.0, 194.0],
        [1394240400000, 120.0, 135.0],
        [1394326800000, 135.0, 177.0]
    ];

    $('#container').highcharts('StockChart', {

        chart: {
            type: 'areasplinerange'
        },

        title: {
            text: 'Compare on area ranges'
        },
        plotOptions: {
            series: {
                fillOpacity: 0.5
            }
        },

        yAxis: [{
            height: '25%',
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        }, {
            height: '25%',
            top: '25%',
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        }, {
            height: '25%',
            top: '50%',
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        }, {
            height: '25%',
            top: '75%',
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        }],

        series: [{
            name: 'areasplinerange - percent',
            type: 'areasplinerange',
            compare: 'percent',
            data: data
        }, {
            name: 'areasplinerange - value',
            type: 'areasplinerange',
            compare: 'value',
            data: data,
            yAxis: 1
        }, {
            name: 'arearange - percent',
            type: 'arearange',
            compare: 'percent',
            data: data,
            yAxis: 2
        }, {
            name: 'arearange - value',
            type: 'arearange',
            compare: 'value',
            data: data,
            yAxis: 3
        }],

        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        }

    });

});
