$(function () {
    $('#container').highcharts({
        chart: {
            type: "area"
        },
        title: {
            text: 'Stacking multiple points on same X'
        },
        yAxis: {
            type: "linear",
            reversedStacks: false,
            min: 0,
            minTickInterval: 1,
            allowDecimals: false,
            title: {
                text: 'Counts'
            }
        },
        plotOptions: {
            area: {
                fillOpacity: 0.1,
                stacking: "normal",
                marker: {
                    enabled: true
                }
            }
        },
        series: [{
            name: "Series 01",
            data: [{
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 12
            }, {
                x: 1,
                y: 1
            }, {
                x: 1,
                y: 0
            }, {
                x: 1,
                y: 5
            }, {
                x: 2,
                y: 9
            }, {
                x: 2,
                y: 2
            }]
        }, {
            name: "Series 02",
            data: [{
                x: 0,
                y: 2
            }, {
                x: 0,
                y: 2
            }, {
                x: 1,
                y: 11
            }, {
                x: 1,
                y: 10
            }, {
                x: 1,
                y: 0
            }, {
                x: 2,
                y: 19
            }, {
                x: 2,
                y: 12
            }]
        }]
    });
});