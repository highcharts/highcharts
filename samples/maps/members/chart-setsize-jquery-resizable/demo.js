$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Set chart size by dragging handle'
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



        var chart = $('#container').highcharts();
        $('#resizer').resizable({
            // On resize, set the chart size to that of the
            // resizer minus padding. If your chart has a lot of data or other
            // content, the redrawing might be slow. In that case, we recommend
            // that you use the 'stop' event instead of 'resize'.
            resize: function () {
                chart.setSize(
                    this.offsetWidth - 20,
                    this.offsetHeight - 20,
                    false
                );
            }
        });
    });
});