$(function () {

    // Create the chart
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Drilldown label styling'
        },
        xAxis: {
            type: 'category'
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [{
            name: 'Things',
            colorByPoint: true,
            data: [{
                name: 'Animals',
                y: 5,
                drilldown: 'animals'
            }, {
                name: 'Fruits',
                y: 2,
                drilldown: 'fruits'
            }, {
                name: 'Cars',
                y: 4
            }]
        }],
        drilldown: {
            activeAxisLabelStyle: {
                textDecoration: 'none',
                fontStyle: 'italic'
            },
            activeDataLabelStyle: {
                textDecoration: 'none',
                fontStyle: 'italic'
            },
            series: [{
                id: 'animals',
                data: [
                    ['Cats', 4],
                    ['Dogs', 2],
                    ['Cows', 1],
                    ['Sheep', 2],
                    ['Pigs', 1]
                ]
            }, {
                id: 'fruits',
                data: [
                    ['Apples', 4],
                    ['Oranges', 2]
                ]
            }]
        }
    });
});

