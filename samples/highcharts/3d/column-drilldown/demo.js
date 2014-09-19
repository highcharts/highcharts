$(function () {
    $('#container').highcharts({
        chart: {
            margin: 75,
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 30,
                beta: 10,
                depth: 50
            }
        },
        xAxis: {
            type: 'category'
        },
        plotOptions: {
            column: {
                depth: 35
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Things',
            data: [{
                name: 'Animals',
                y: 6,
                drilldown: 'animals'
            }, {
                name: 'Cars',
                y: 18,
                drilldown: 'cars'
            }, {
                name: 'Fruits',
                y: 12,
                drilldown: 'fruits'
            }],
            stack: 0
        }],
        drilldown: {
            series: [{
                id: 'animals',
                name: 'Animals',
                data: [{
                    name: 'Hamsters',
                    y: 2
                }, {
                    name: 'Rabbits',
                    y: 3
                }, {
                    name: 'Squirrels',
                    y: 1
                }]
            }, {
                id: 'cars',
                name: 'Cars',
                data: [{
                    name: 'Skoda',
                    y: 5
                }, {
                    name: 'Toyota',
                    y: 3
                }, {
                    name: 'Ford',
                    y: 4
                }, {
                    name: 'Subaru',
                    y: 6
                }]
            }, {
                id: 'fruits',
                name: 'Fruits',
                data: [{
                    name: 'Bananas',
                    y: 4
                }, {
                    name: 'Apples',
                    y: 3
                }, {
                    name: 'Oranges',
                    y: 2
                }, {
                    name: 'Mango',
                    y: 0
                }, {
                    name: 'Pears',
                    y: 3
                }]
            }]
        }
    });
});