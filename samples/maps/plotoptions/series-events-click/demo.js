

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Series click event test'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        plotOptions: {
            series: {
                events: {
                    click: function (e) {
                        var text = '<b>Clicked</b><br>Series: ' + this.name +
                                '<br>Point: ' + e.point.name + ' (' + e.point.value + '/km²)';
                        if (!this.chart.clickLabel) {
                            this.chart.clickLabel = this.chart.renderer.label(text, 0, 250)
                                .css({
                                    width: '180px'
                                })
                                .add();
                        } else {
                            this.chart.clickLabel.attr({
                                text: text
                            });
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