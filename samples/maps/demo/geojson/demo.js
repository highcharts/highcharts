$(function () {

    Highcharts.geojson = function (geojson, hType) {
        var each = Highcharts.each,
            mapData = [],
            path;
            polygonToPath = function (polygon) {
                path.push('M');
                each (polygon, function (point, i) {
                    if (i === 1) {
                        path.push('L');
                    }
                    path.push(point[0], point[1]);
                });
            };
        each(geojson.features, function (feature) {
            var type;

            path = [];

            if (hType === 'map') {
                if (feature.geometry.type === 'Polygon') {
                    each(feature.geometry.coordinates, polygonToPath);
                    path.push('Z');

                } else if (feature.geometry.type === 'MultiPolygon') {
                    each(feature.geometry.coordinates, function (items) {
                        each(items, polygonToPath);
                    });
                    path.push('Z');                    
                }
            }
            mapData.push({
                path: path,
                name: feature.properties.name,
                //code_hasc: feature.properties.code_hasc,
                properties: feature.properties
            });
            
        });
        return mapData;
    };


    // Prepare random data
    var data = [
        {
            "code": "DE.SH",
            "value": 728
        },
        {
            "code": "DE.BE",
            "value": 710
        },
        {
            "code": "DE.MV",
            "value": 963
        },
        {
            "code": "DE.HB",
            "value": 541
        },
        {
            "code": "DE.HH",
            "value": 622
        },
        {
            "code": "DE.RP",
            "value": 866
        },
        {
            "code": "DE.SL",
            "value": 398
        },
        {
            "code": "DE.BY",
            "value": 785
        },
        {
            "code": "DE.SN",
            "value": 223
        },
        {
            "code": "DE.ST",
            "value": 605
        },
        {
            "code": "DE.",
            "value": 361
        },
        {
            "code": "DE.NW",
            "value": 237
        },
        {
            "code": "DE.BW",
            "value": 157
        },
        {
            "code": "DE.HE",
            "value": 134
        },
        {
            "code": "DE.NI",
            "value": 136
        },
        {
            "code": "DE.TH",
            "value": 704
        }
    ];

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=germany.geo.json&callback=?', function (geojson) {
        
        // Initiate the chart
        $('#container').highcharts('Map', {
            
            title : {
                text : 'Geojson in Highmaps'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000
            },

            series : [{
                data : data,
                mapData: Highcharts.geojson(geojson, 'map'),
                joinBy: ['code_hasc', 'code'],
                name: 'Random data',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.postal}'
                }
            }]
        });
    });
});