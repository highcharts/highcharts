$(function() {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
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
            data: [7, 5, 10]},
        {
            name: "bbb",
            data: [0, 22, 3]},
        {
            name: "A really really really really  long name",
            data: [13, 13, 47]},
        {
            name: "ccc",
            data: [19, 5, 16]}]
    });
});