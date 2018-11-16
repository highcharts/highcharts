import * as Highcharts from 'highcharts';
import DraggablePointsModule from "highcharts/modules/draggable-points";

DraggablePointsModule(Highcharts);

function test_options {
    Highcharts.chart('container', {
        chart: {
            animation: false
        },
        title: {
            text: 'Highcharts draggable points demo'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
                'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            softMin: -200,
            softMax: 400
        },
        plotOptions: {
            series: {
                stickyTracking: false,
                dragDrop: {
                    draggableY: true
                }
            },
            column: {
                stacking: 'normal',
                minPointLength: 2
            },
            line: {
                cursor: 'ns-resize'
            }
        },
        tooltip: {
            yDecimals: 2
        },
        series: [{
            data: [0, 71.5, -106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
                -95.6, 54.4],
            type: 'column'
        }, {
            data: [0, -71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
                95.6, 54.4].reverse(),
            type: 'column'
        }, {
            data: [0, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
                95.6, 54.4],
            type: 'line'
        }]
    });
}