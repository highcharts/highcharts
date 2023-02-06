(async () => {
    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {

        title: {
            text: 'Highcharts Maps basic flight routes demo'
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
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat:
                            'Origin: {point.options.from}, Destination: {point.options.to}.'
                    },
                    description:
                        'This is a map showing flight routes.'
                }
            },
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}.'
                    }
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
                lat: 51.51,
                lon: -0.13
            }, {
                id: 'Birmingham',
                lat: 52.48,
                lon: -1.89
            }, {
                id: 'Leeds',
                lat: 53.8,
                lon: -1.55
            }, {
                id: 'Glasgow',
                lat: 55.86,
                lon: -4.26
            }, {
                id: 'Sheffield',
                lat: 53.38,
                lon: -1.47
            }, {
                id: 'Liverpool',
                lat: 53.4,
                lon: -3
            }, {
                id: 'Bristol',
                lat: 51.45,
                lon: -2.58
            }, {
                id: 'Belfast',
                lat: 54.6,
                lon: -5.93
            }, {
                id: 'Lerwick',
                lat: 60.16,
                lon: -1.15,
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
            width: 2,
            markerEnd: {
                enabled: false
            },
            color: '#940129',
            fillColor: '#fc1754',
            fillOpacity: 0.5,
            data: [{
                from: 'Lerwick',
                to: 'Glasgow'
            }, {
                from: 'Lerwick',
                to: 'Belfast'
            }, {
                from: 'Lerwick',
                to: 'Leeds'
            }, {
                from: 'Lerwick',
                to: 'Liverpool'
            }]
        }, {
            type: 'flowmap',
            linkedTo: 'cities',
            name: 'From London',
            width: 2,
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
