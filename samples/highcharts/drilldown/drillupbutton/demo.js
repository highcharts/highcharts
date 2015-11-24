$(function () {

    Highcharts.setOptions({
        lang: {
            drillUpText: '<< Terug naar {series.name}'
        }
    });

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
                name: 'Dieren',
                y: 5,
                drilldown: 'animals'
            }, {
                name: 'Fruit',
                y: 2,
                drilldown: 'fruits'
            }, {
                name: 'Auto\'s',
                y: 4
            }]
        }],
        drilldown: {
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    y: 0,
                    x: 0
                },
                theme: {
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#bada55'
                        },
                        select: {
                            stroke: '#039',
                            fill: '#bada55'
                        }
                    }
                }

            },
            series: [{
                id: 'animals',
                data: [
                    ['Katten', 4],
                    ['Honden', 2],
                    ['Koeien', 1],
                    ['Schapen', 2],
                    ['Varkens', 1]
                ]
            }, {
                id: 'fruits',
                data: [
                    ['Appels', 4],
                    ['Sinaasappels', 2]
                ]
            }]
        }
    });
});

