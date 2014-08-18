$(function () {

    // Create the chart
    $('#container').highcharts({
        chart: {
            type: 'column',
            events: {
                drilldown: function (e) {
                    if (!e.seriesOptions) {

                        var chart = this,
                            drilldowns = {
                                'Animals': {
                                    name: 'Animals',
                                    data: [
                                        ['Cows', 2],
                                        ['Sheep', 3]
                                    ]
                                },
                                'Fruits': {
                                    name: 'Fruits',
                                    data: [
                                        ['Apples', 5],
                                        ['Oranges', 7],
                                        ['Bananas', 2]
                                    ]
                                },
                                'Cars': {
                                    name: 'Cars',
                                    data: [
                                        ['Toyota', 1],
                                        ['Volkswagen', 2],
                                        ['Opel', 5]
                                    ]
                                }
                            },
                            series = drilldowns[e.point.name];

                        // Show the loading label
                        chart.showLoading('Simulating Ajax ...');

                        setTimeout(function () {
                            chart.hideLoading();
                            chart.addSeriesAsDrilldown(e.point, series);
                        }, 1000);
                    }

                }
            }
        },
        title: {
            text: 'Async drilldown'
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
                drilldown: true
            }, {
                name: 'Fruits',
                y: 2,
                drilldown: true
            }, {
                name: 'Cars',
                y: 4,
                drilldown: true
            }]
        }],

        drilldown: {
            series: []
        }
    });
});

