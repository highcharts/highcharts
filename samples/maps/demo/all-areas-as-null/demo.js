$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=europe.geo.json&callback=?', function (geojson) {

        // Instanciate the map
        $('#container').highcharts('Map', {
            chart : {
                borderWidth : 1
            },
            
            title : {
                text : 'Nordic countries'
            },
            subtitle : {
                text : 'Demo of drawing all areas in the map, only highlighting partial data'
            },

            legend: {
                enabled: false
            },
            
            series : [{
                name: 'Country',
                data: [{
                    code: 'IS',
                    value: 1
                }, {
                    code: 'NO',
                    value: 1
                }, {
                    code: 'SE',
                    value: 1
                }, {
                    code: 'FI',
                    value: 1
                }, {
                    code: 'DK',
                    value: 1
                }],
                joinBy: ['WB_A2', 'code'],
                dataLabels: {
                    enabled: true,
                    color: 'white',
                    formatter: function () {
                        if (this.point.value) {
                            return this.point.name;
                        }
                    },
                    format: null,
                    style: {
                        fontWeight: 'bold',
                        textShadow: '0 0 3px black'
                    }
                },
                mapData: Highcharts.geojson(geojson, 'map'),
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}'
                }
            }]
        });
    });
});