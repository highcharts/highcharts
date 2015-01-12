$(function () {
    $("#container").highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            categories: ['Cat1', 'Cat2', 'Cat3']
        },
        series: [{
            data: [{
                y: 20,
                drilldown: 'dd1'
            }]
        }, {
            visible: false,
            data: [{
                y: 30,
                drilldown: 'dd2'
            }]
        }],
        drilldown: {
            series: [{
                id: 'dd1',
                data: [10, 20, 30],
                name: 'Drilldown1'
            }, {
                id: 'dd2',
                data: [20, 10, 30],
                name: 'Drilldown2'
            }]
        }
    });
});
