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

        tooltip: {
            formatter: function () {
                return this.point.id + (
                    this.point.lat ?
                        '<br>Lat: ' + this.point.lat +
                        ' Lon: ' + this.point.lon : ''
                );
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
            minWeight: 8,
            maxWeight: 12,
            growTowards: true,

            markerEnd: {
                markerType: 'arrow',
                width: '50%',
                height: '50%'
            },

            color: '#940129',
            fillColor: '#fc1754',
            fillOpacity: 0.5,

            data: [{
                id: 'Lerwick - Glasgow',
                from: 'Lerwick',
                to: 'Glasgow',
                weight: 10,
                curveFactor: -0.2
            }, {
                id: 'Lerwick - Belfast',
                from: 'Lerwick',
                to: 'Belfast',
                weight: 5,
                curveFactor: -0.7
            }, {
                id: 'Lerwick - Leeds',
                from: 'Lerwick',
                to: 'Leeds',
                weight: 20,
                curveFactor: 0.2
            }, {
                id: 'Lerwick - Liverpool',
                from: 'Lerwick',
                to: 'Liverpool',
                weight: 0.1,
                curveFactor: -0.3
            }]
        }, {
            type: 'flowmap',
            linkedTo: 'cities',
            minWeight: 8,
            maxWeight: 12,
            growTowards: true,

            fillColor: '#faa243',
            fillOpacity: 0.5,
            color: '#c2721d',

            markerEnd: {
                markerType: 'arrow',
                width: '50%',
                height: '50%'
            },

            data: [{
                id: 'London - Glasgow',
                from: 'London',
                to: 'Glasgow',
                curveFactor: 1,
                weight: 45
            }, {
                id: 'London - Belfast',
                from: 'London',
                to: 'Belfast',
                curveFactor: 1,
                weight: 10
            }, {
                id: 'London - Leeds',
                from: 'London',
                to: 'Leeds',
                curveFactor: -1.0,
                weight: 30
            }, {
                id: 'London - Liverpool',
                from: 'London',
                to: 'Liverpool',
                curveFactor: 1,
                weight: 20
            }, {
                id: 'London - Sheffield',
                from: 'London',
                to: 'Sheffield',
                curveFactor: -0.3,
                weight: 20
            }, {
                id: 'London - Birmingham',
                from: 'London',
                to: 'Birmingham',
                curveFactor: -0.2,
                weight: 2
            }, {
                id: 'London - Bristol',
                from: 'London',
                to: 'Bristol',
                curveFactor: 1,
                weight: 33
            }]
        }]
    });
})();
