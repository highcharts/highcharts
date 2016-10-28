$(function () {

    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Point placement with individual point ranges'
        },
        xAxis: {
            tickPositions: [0, 2, 3, 4, 5, 6],
            gridLineWidth: 1
        },

        plotOptions: {
            column: {
                pointPadding: 0,
                groupPadding: 0,
                borderWidth: 0,
                grouping: false,
                pointPlacement: 'between'
            }
        },

        series: [{
            data: [
                [2, 70],
                [3, 60],
                [4, 50],
                [5, 40]
            ],
            pointRange: 1
            //  pointPlacement: 0.25
        }, {
            pointRange: 2,
            data: [
                [0, 80]
            ]
        }]
    });
});
