$(function () {
    var options = {

        chart: {
            height: 300,
            type: 'column',
            animation: false
        },

        title: {
            text: 'Drill up failed on top level'
        },
        subtitle: {
            text: '... when points added dynamically'
        },

        xAxis: {
            type: 'category'
        },

        drilldown: {
            animation: false,
            series: [{
                id: 'fruits',
                name: 'Fruits',
                data: [
                    ['Apples', 4],
                    ['Pears', 6],
                    ['Oranges', 2],
                    ['Grapes', 8]
                ]
            }, {
                id: 'cars',
                name: 'Cars',
                data: [{
                    name: 'Toyota',
                    y: 4,
                    drilldown: 'toyota'
                },
                ['Volkswagen', 3],
                ['Opel', 5]
                ]
            }, {
                id: 'toyota',
                name: 'Toyota',
                data: [
                    ['RAV4', 3],
                    ['Corolla', 1],
                    ['Carina', 4],
                    ['Land Cruiser', 5]
                ]
            }]
        },

        series: [{
            name: 'Overview',
            colorByPoint: true,
            id: 'top'
        }]
    };

    Highcharts.chart('container', options, function (chart) {
        chart.series[0].setData([{
            name: 'Fruits',
            y: 10,
            drilldown: 'fruits'
        }, {
            name: 'Cars',
            y: 12,
            drilldown: 'cars'
        }, {
            name: 'Countries',
            y: 8
        }]);
    });
});

