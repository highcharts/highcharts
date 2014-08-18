$(function () {
    $('#container').highcharts({
        title: {
            text: 'Hover over legend item of invisible point'
        },
        plotOptions: {
            pie: {
                showInLegend: true
            }
        },
        series: [{
            ignoreHiddenPoint: false,
            type: 'pie',
            data: [
                ['Apples', 5],
                ['Pears', 3],
                {
                    name: 'Carrots',
                    y: 2,
                    visible: false
                },
                ['Bananas', 2]
            ]
        }]
    });
});