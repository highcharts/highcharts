$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                events: {
                    resize: function () {
                        this.setTitle(null, {
                            text: 'Chart width: ' + this.chartWidth + '<br/>' +
                                'Chart height: ' + this.chartHeight
                        });
                    }
                },
                borderWidth: 1
            },

            subtitle: {
                align: 'left',
                verticalAlign: 'middle',
                floating: true
            },

            title : {
                text : 'Set subtitle on chart resize. Resize browser or frame to view.'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
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