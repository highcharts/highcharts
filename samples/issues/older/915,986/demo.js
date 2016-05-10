$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'

        },
        legend: {
            width: 420,
            itemWidth: 210,
            itemStyle: {
                width: 210
            }
        },
        series: [
            {
                name: "aaa",
                data: [7] },
            {
                name: "bbb",
                data: [0] },
            {
                name: "A really really really really  long name",
                data: [13] },
            {
                name: "ccc",
                data: [19] }]
    });
});