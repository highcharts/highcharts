$(function () {

    // Create the chart
    $('#container').highcharts({
        chart: {
            type: 'column',
            animation: false
        },
        title: {
            text: 'Multilevel drilldown. Levels got mixed up.'
        },
        xAxis: {
            type: 'category'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                animation: false,
                borderWidth: 0,
                colorByPoint: true,
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [{
            name: 'Things',
            data: [{
                name: 'Animals',
                y: 5,
                drilldown: 'animals'
            }]
        }, {
            name: 'Things2',
            data: [{
                name: 'Animals',
                y: 1,
                drilldown: 'animals2'
            }]
        }],
        drilldown: {
            animation: false,
            series: [{
                id: 'animals',
                name: 'Animals',
                data: [{
                    name: 'Cats',
                    y: 4,
                    drilldown: 'specialcat'
                }

                ]
            }, {
                id: 'animals2',
                name: 'Animals2',
                data: [{
                    name: 'Cats',
                    y: 3,
                    drilldown: 'specialcat2'
                }]
            }, {
                id: 'specialcat',
                name: 'Cats2',
                data: [
                    ['Siamese', 5],
                    ['Tabby', 10]
                ]
            }, {
                id: 'specialcat2',
                name: 'Cats2-2',
                data: [
                    ['Siamese2', 5],
                    ['Tabby2', 10]
                ]
            }]
        }
    });
});