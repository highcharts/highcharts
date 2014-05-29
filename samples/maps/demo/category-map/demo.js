$(function () {

    $.getJSON('http://www.highcharts.local/samples/data/jsonp.php?filename=europe.geo.json&callback=?', function (geojson) {
        
        // Instanciate the map
        $('#container').highcharts('Map', {
            title : {
                text : 'Europe time zones'
            },
            
            legend: {
                enabled: true
            },

            plotOptions: {
                map: {
                    allAreas: false,
                    joinBy: ['WB_A2', 'code'],
                    dataLabels: {
                        enabled: true,
                        color: 'white',
                        formatter: function () {
                            if (this.point.properties.LABELRANK.toString() < 5) {
                                return this.point.properties.WB_A2;
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
                        pointFormat: '{point.name}: <b>{series.name}</b>'
                    }

                }
            },
            
            series : [{
                name: 'UTC',
                data: $.map(['IE', 'IS', 'GB', 'PT'], function (code) {
                    return { code: code };
                })
            }, {
                name: 'UTC + 1',
                data: $.map(['NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL', 'CZ', 'AT', 'CH', 'LI', 'SK', 'HU',
                        'SI', 'IT', 'SM', 'HR', 'BA', 'YF', 'ME', 'AL', 'MK'], function (code) {
                    return { code: code };
                })
            }, {
                name: 'UTC + 2',
                data: $.map(['FI', 'EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RO', 'BG', 'GR', 'TR', 'CY'], function (code) {
                    return { code: code };
                })
            }, {
                name: 'UTC + 3',
                data: $.map(['RU'], function (code) {
                    return { code: code };
                })
            }]
        });
    });
});