// Create the chart
Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: ''
    },

    subtitle: {
        text: ''
    },

    navigation: {
        buttonOptions: {
            align: 'left',
            theme: {
                stroke: '#e6e6e6'
            }
        }
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            alignTo: 'spacingBox'
        }
    },

    mapView: {
        center: [10.73028454146517, 59.91261204279989],
        zoom: 13,
        fitToGeometry: {
            type: 'MultiPoint',
            coordinates: [
                [10.55, 59.95],
                [10.9, 59.87]
            ]
        }
    },

    tooltip: {
        pointFormat: '{point.name}'
    },

    legend: {
        enabled: true,
        title: {
            text: 'Attractions in Oslo'
        },
        align: 'left',
        symbolWidth: 20,
        symbolHeight: 20,
        itemStyle: {
            textOutline: '1 1 1px rgba(255,255,255)'
        },
        backgroundColor: 'rgba(255,255,255,0.8)',
        float: true,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderRadius: 2,
        itemMarginBottom: 5
    },

    plotOptions: {
        mappoint: {
            dataLabels: {
                enabled: false
            }
        }
    },

    series: [{
        type: 'tiledwebmap',
        name: 'Basemap Tiles',
        provider: {
            type: 'OpenStreetMap'
        },
        showInLegend: false
    }, {
        type: 'mappoint',
        name: 'Museums',
        marker: {
            symbol: 'url(https://cdn.jsdelivr.net/gh/highcharts/highcharts@67f46da560/samples/graphics/museum.svg)',
            width: 24,
            height: 24
        },
        data: [{
            name: 'Fram Museum',
            geometry: {
                type: 'Point',
                coordinates: [10.692997228, 59.901996392]
            }
        }, {
            name: 'Vigeland Museum',
            geometry: {
                type: 'Point',
                coordinates: [10.70013, 59.92285]
            }
        }, {
            name: 'Norwegian Museum of Cultural History',
            geometry: {
                type: 'Point',
                coordinates: [10.6849055937, 59.9041430501]
            }
        }, {
            name: 'The Viking Ship Museum (Vikingskipshuset)',
            geometry: {
                type: 'Point',
                coordinates: [10.684461, 59.904756]
            }
        }, {
            name: 'Museum of Cultural History',
            geometry: {
                type: 'Point',
                coordinates: [10.735472, 59.916806]
            }
        }, {
            name: 'The Astrup Fearnley Museum of Modern Art',
            geometry: {
                type: 'Point',
                coordinates: [10.720863, 59.907062]
            }
        }, {
            name: 'Munch Museum',
            geometry: {
                type: 'Point',
                coordinates: [10.755656, 59.906169]
            }
        }, {
            name: 'Natural History Museum at the University of Oslo',
            geometry: {
                type: 'Point',
                coordinates: [10.7717, 59.9198]
            }
        }]
    }, {
        type: 'mappoint',
        name: 'Parks',
        marker: {
            symbol: 'url(https://cdn.jsdelivr.net/gh/highcharts/highcharts@67f46da560/samples/graphics/tree.svg)',
            width: 24,
            height: 24
        },
        data: [{
            name: 'The Vigeland Park',
            geometry: {
                type: 'Point',
                coordinates: [10.705147, 59.924484]
            }
        }, {
            name: 'Frogner Park',
            geometry: {
                type: 'Point',
                coordinates: [10.703473, 59.926458]
            }
        }, {
            name: 'The University\'s Botanical Garden',
            geometry: {
                type: 'Point',
                coordinates: [10.7699, 59.9174]
            }
        }]
    }, {
        type: 'mappoint',
        name: 'Great buildings',
        marker: {
            symbol: 'url(https://cdn.jsdelivr.net/gh/highcharts/highcharts@67f46da560/samples/graphics/building.svg)',
            width: 24,
            height: 24
        },
        data: [{
            name: 'The Norwegian National Opera & Ballet',
            geometry: {
                type: 'Point',
                coordinates: [10.751825, 59.90766]
            }
        }, {
            name: 'Akershus Fortress',
            geometry: {
                type: 'Point',
                coordinates: [10.736011, 59.907667]
            }
        }, {
            name: 'Royal Palace in Oslo',
            geometry: {
                type: 'Point',
                coordinates: [10.7275, 59.916944]
            }
        }, {
            name: 'Oslo City Hall',
            geometry: {
                type: 'Point',
                coordinates: [10.733583, 59.911764]
            }
        }, {
            name: 'Akrobaten bru',
            geometry: {
                type: 'Point',
                coordinates: [10.759654, 59.909714]
            }
        }]
    }, {
        type: 'mappoint',
        name: 'Restaurants',
        marker: {
            symbol: 'url(https://cdn.jsdelivr.net/gh/highcharts/highcharts@67f46da560/samples/graphics/eat.svg)',
            width: 24,
            height: 24
        },
        data: [{
            name: 'Elias mat & sånt',
            geometry: {
                type: 'Point',
                coordinates: [10.738687049524728, 59.9163183916486]
            }
        }, {
            name: 'Østbanehallen renovated train station & food court',
            geometry: {
                type: 'Point',
                coordinates: [10.751095761430776, 59.91085233408226]
            }
        }]
    }]
});
