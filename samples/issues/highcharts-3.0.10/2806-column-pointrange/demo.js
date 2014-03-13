$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },

        title: {
            text: 'Category axis was wrong when the second series had greater point distance than the first series'
        },

        xAxis: {
            categories: ['Cat0', 'Cat1', 'Cat2', 'Cat3']
        },

        plotOptions: {
            column: {
                stacking: true
            }
        },

        series: [{
            name: "CL1",
            data: [{
                x: 0,
                y: 1
            }, {
                x: 1,
                y: 2
            }, {
                x: 2,
                y: 2
            }, {
                x: 3,
                y: 2
            }]
        }, {
            name: "CL2",
            data: [{
                x: 0,
                y: 3
            }, {
                x: 2,
                y: 4
            }]
        }]
    });
});