// Prepare random data
var data = [
    ['DE.BY.NI', 955],
    ['DE.BY.OB', 233],
    ['DE.BY.OF', 1],
    ['DE.BY.OP', 316],
    ['DE.BY.SC', 742],
    ['DE.BY.UF', 848],
    ['DE.BW.FR', 880],
    ['DE.BW.KR', 831],
    ['DE.BW.ST', 394],
    ['DE.BW.TU', 201],
    ['DE.BY.MF', 406],
    ['DE.BE.BE', 193],
    ['DE.BB.BB', 74],
    ['DE.HB.HB', 710],
    ['DE.HH.HH', 567],
    ['DE.HE.DA', 612],
    ['DE.HE.GI', 335],
    ['DE.HE.KS', 975],
    ['DE.MV.MV', 939],
    ['DE.NW.AR', 869],
    ['DE.NW.DM', 821],
    ['DE.NW.DU', 172],
    ['DE.NW.KL', 539],
    ['DE.NW.MU', 307],
    ['DE.RP.RL', 199],
    ['DE.SL.SL', 600],
    ['DE.SN.CH', 841],
    ['DE.SN.DR', 58],
    ['DE.SN.LE', 78],
    ['DE.SH.SH', 2],
    ['DE.TH.TH', 353]
];

$.getJSON(
    'https://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/germany/germany-regions.json',
    function (topology) {
        var geojson = window.topojson.feature(
            topology,
            topology.objects.DEU_adm2
        );

        // Optionally project the data using Proj4. This costs performance, and
        // when possible, should be done on the server.
        function projectPolygon(coordinate) {
            coordinate.forEach(function (lonLat, i) {
                var projected = window.proj4('EPSG:3857', lonLat);
                coordinate[i] = projected;
            });
        }
        geojson.features.forEach(function (feature) {
            if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates.forEach(projectPolygon);
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(function (items) {
                    items.forEach(projectPolygon);
                });
            }
        });

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'TopoJSON in Highmaps'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                tickPixelInterval: 100
            },

            tooltip: {
                pointFormat: '{point.properties.NAME_2}: {point.value}'
            },

            series: [{
                data: data,
                keys: ['HASC_2', 'value'],
                joinBy: 'HASC_2',
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.NAME_2}'
                }
            }]
        });
    }
);
