(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Example route of the ship from USA to China'
        },

        subtitle: {
            text: `The route through the Suez Canal with a number of travel days
            between cities`
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            center: [10, 20],
            zoom: 2.2
        },

        tooltip: {
            formatter: function (tooltip) {
                if (this.series.name === 'Ship Routes') {
                    return tooltip.defaultFormatter.call(this, tooltip);
                }
                return '<b>' + this.point.id + '</b>' + (
                    this.point.lat ?
                        '<br>Lat: ' + this.point.lat +
                        ' Lon: ' + this.point.lon :
                        ''
                );
            }
        },

        series: [{
            name: 'Basemap',
            states: {
                inactive: {
                    enabled: false
                }
            },
            showInLegend: false
        }, {
            type: 'mappoint',
            name: 'Cities',
            data: [{
                id: 'Houston',
                lat: 29.75,
                lon: -95.36
            }, {
                id: 'Miami',
                lat: 25.76,
                lon: -80.19
            }, {
                id: 'Algeciras',
                lat: 36.17,
                lon: -5.35
            }, {
                id: 'Malta',
                lat: 35.92,
                lon: 14.41
            }, {
                id: 'Beirut',
                lat: 33.89,
                lon: 35.50
            }, {
                id: 'Jeddah',
                lat: 21.49,
                lon: 39.18
            }, {
                id: 'Singapore',
                lat: 1.29,
                lon: 103.85
            }, {
                id: 'Vung Tao',
                lat: 10.39,
                lon: 107.09
            }, {
                id: 'Hong Kong',
                lat: 22.39,
                lon: 114.11
            }]
        }, {
            type: 'flowmap',
            linkedTo: ':previous',
            fillColor: '#b37e24',
            fillOpacity: 0.2,
            color: '#7d4015',
            name: 'Ship Routes',
            growTowards: true,
            markerEnd: {
                height: 10,
                width: 5
            },
            data: [{
                from: 'Houston',
                to: 'Miami',
                weight: 5,
                curveFactor: -0.5
            }, {
                from: 'Miami',
                to: 'Algeciras',
                weight: 22,
                curveFactor: -0.15,
                markerEnd: {
                    height: 30,
                    width: 15
                }
            }, {
                from: 'Algeciras',
                to: 'Malta',
                weight: 2,
                curveFactor: 0.3
            }, {
                from: 'Malta',
                to: 'Beirut',
                weight: 4,
                curveFactor: -0.4
            }, {
                from: 'Beirut',
                to: 'Jeddah',
                weight: 4,
                curveFactor: -0.4
            }, {
                from: 'Jeddah',
                to: 'Singapore',
                weight: 10,
                curveFactor: -0.4,
                markerEnd: {
                    height: 20,
                    width: 12
                }
            }, {
                from: 'Singapore',
                to: 'Vung Tao',
                weight: 3

            }, {
                from: 'Vung Tao',
                to: 'Hong Kong',
                weight: 3,
                curveFactor: -0.4,
                markerEnd: {
                    height: 15,
                    width: 8
                }
            }]
        }]
    });
})();
