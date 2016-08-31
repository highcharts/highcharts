$(function () {
    $('#container').highcharts({
        chart: {
            type: 'bar',
            height: 170,
            marginLeft: 100
        },
        legend: {
            enabled: false
        },
        title: {
            text: "Highcharts 3.0.9: skipped labels"
        },
        xAxis: {
            categories: ["category1", "longer category", "category 3", "longer category"],
            labels: {
                align: 'right',
                step: 0
            }
        },
        series: [{
            data: [25, 3, 100, 8]
        }],
        credits: {
            enabled: false
        },
        yAxis: {
            title: null
        }
    });
});