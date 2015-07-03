$(function () {
    $('#container').highcharts({
        chart: {
            type: 'area'
        },

        title: {
            text: 'Percent stack with negative values'
        },

        plotOptions: {
            series: {
                stacking: 'percent'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>'
        },
        series: [{
            data: [1, -1, 1],
            zIndex: 4
        }, {
            data: [2, 2, 2],
            zIndex: 3
        }, {
            data: [1, -1, 1],
            zIndex: 2,
            type: 'column'
        }, {
            data: [2, 2, 2],
            zIndex: 1,
            type: 'column'
        }]
    });
});