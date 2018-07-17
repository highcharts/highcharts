

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Point click event test'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function () {
                            var text = '<b>Clicked point</b><br>Series: ' + this.series.name +
                                    '<br>Point: ' + this.name + ' (' + this.value + '/km²)',
                                chart = this.series.chart;
                            if (!chart.clickLabel) {
                                chart.clickLabel = chart.renderer.label(text, 0, 250)
                                    .css({
                                        width: '180px'
                                    })
                                    .add();
                            } else {
                                chart.clickLabel.attr({
                                    text: text
                                });
                            }
                        }
                    }
                }
            }
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            pointer: 'cursor',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});