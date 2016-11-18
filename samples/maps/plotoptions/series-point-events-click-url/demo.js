$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

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
                                location.href = 'http://en.wikipedia.org/wiki/' + this.name;
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
                cursor: 'pointer',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                tooltip: {
                    pointFormat: '{point.name}: {point.value}/km²<br><span style="color:gray;font-size:11px">Click to view Wikipedia article</span>'
                }
            }]
        });
    });
});