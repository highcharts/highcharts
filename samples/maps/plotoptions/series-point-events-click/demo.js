$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Point click event test'
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

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                pointer: 'cursor',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });
});