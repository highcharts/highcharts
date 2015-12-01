$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Initiate the chart
        $('#container').highcharts('Map', {

            title: {
                text: 'Tooltip format demo'
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },


            tooltip: {
                headerFormat: '<span style="font-size:10px">{series.name}</span><br/>',
                pointFormat: '{point.name}: <b>{point.value:.1f} individuals/km²</b><br/>',
                footerFormat: '<span style="font-size:10px">Source: Wikipedia</span><br/>'
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
                }
            }]
        });
    });
});