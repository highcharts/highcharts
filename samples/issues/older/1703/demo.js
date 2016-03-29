$(function () {

    $('#container').highcharts({
        chart: {
            type: 'arearange'
        },
        title: {
            text: 'Test for null in low and high positions'
        },
        subtitle: {
            text: 'Chart should show four separate blocks.'
        },
        series: [{
            data: [[1,3], [1,3], [null, 5], [2,4], [2,4], [1,null], [1,3], [1,3],[null, null], [0,5], [0,5]]
        }]

    });

});