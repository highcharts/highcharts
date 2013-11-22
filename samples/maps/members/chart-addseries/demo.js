$(function () {

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {
        
        // Initiate the chart
        $('#container').highcharts('Map', {
            
            title : {
                text : 'Click button to add series'
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
            }
        });

        $('#addseries')
            .click(function () {
                $('#container').highcharts().addSeries({
                    data: data,
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
                });
                $(this).attr('disabled', true);
            })
            .attr('disabled', false);
        
    });
});