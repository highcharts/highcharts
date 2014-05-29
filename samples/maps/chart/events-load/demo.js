$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {
        
        // Initiate the chart
        $('#container').highcharts('Map', {

            chart: {
                events: {
                    load: function (e) {
                        this.addSeries({
                            type: 'mappoint',
                            data: [{
                                x: 1000,
                                y: 4000,
                                name: 'Point added on chart load'
                            }],
                            name: 'Series added on chart load'
                        })
                    }
                }
            },
            
            title : {
                text : 'Add series on chart load'
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
                mapData: Highcharts.maps.world,
                joinBy: 'code',
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