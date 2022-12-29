(async () => {
    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {

        title: {
            text: 'Highmaps basic flight routes demo'
        },

        subtitle: {
            text: 'Demo of Highcharts map with flowmap'
        },

        mapNavigation: {
            enabled: true
        },

        plotOptions: {
            flowmap: {
                tooltip: {
                    headerFormat: null,
                    pointFormat: `{point.options.from} \u2192 
                        {point.options.to}`
                }
            },
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                }
            }
        },

        series: [{
            // Use the gb-all map with no data as a basemap
            mapData,
            name: 'Great Britain',
            borderColor: '#a8a8a8',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false,
            states: {
                inactive: {
                    enabled: false
                }
            }
        }, {
            // Specify cities using lat/lon
            type: 'mappoint',
            id: 'cities',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}'
            },
            // Use id instead of name to allow for referencing points later using the flowmap series.
            data: [{
                id: 'London',
                lat: 51.507222,
                lon: -0.1275
            }, {
                id: 'Birmingham',
                lat: 52.483056,
                lon: -1.893611
            }, {
                id: 'Leeds',
                lat: 53.799722,
                lon: -1.549167
            }, {
                id: 'Glasgow',
                lat: 55.858,
                lon: -4.259
            }, {
                id: 'Sheffield',
                lat: 53.383611,
                lon: -1.466944
            }, {
                id: 'Liverpool',
                lat: 53.4,
                lon: -3
            }, {
                id: 'Bristol',
                lat: 51.45,
                lon: -2.583333
            }, {
                id: 'Belfast',
                lat: 54.597,
                lon: -5.93
            }, {
                id: 'Lerwick',
                lat: 60.155,
                lon: -1.145,
                dataLabels: {
                    align: 'left',
                    x: 5,
                    verticalAlign: 'middle'
                }
            }]
        }, {
            type: 'flowmap',
            linkedTo: 'cities',
            name: 'From Lerwick',
            minWidth: 2,
            maxWidth: 2,
            weight: 2,
            markerEnd: {
                enabled: false
            },
            color: '#940129',
            fillColor: '#fc1754',
            fillOpacity: 0.5,
            data: [{
                from: 'Lerwick',
                to: 'Glasgow',
                weight: 10
            }, {
                from: 'Lerwick',
                to: 'Belfast',
                weight: 5
            }, {
                from: 'Lerwick',
                to: 'Leeds',
                weight: 20
            }, {
                from: 'Lerwick',
                to: 'Liverpool',
                weight: 0.1
            }]
        }, {
            type: 'flowmap',
            linkedTo: 'cities',
            name: 'From London',
            minWidth: 2,
            maxWidth: 2,
            weight: 2,
            fillColor: '#faa243',
            fillOpacity: 0.5,
            color: '#c2721d',
            markerEnd: {
                enabled: false
            },
            data: [{
                from: 'London',
                to: 'Glasgow'
            }, {
                from: 'London',
                to: 'Belfast'
            }, {
                from: 'London',
                to: 'Leeds'
            }, {
                from: 'London',
                to: 'Liverpool'
            }, {
                from: 'London',
                to: 'Sheffield'
            }, {
                from: 'London',
                to: 'Birmingham'
            }, {
                from: 'London',
                to: 'Bristol'
            }]
        }]
    });
})();
