(function (H) {
    class CustomProviderDefinition {
        constructor() {
            this.themes = {
                Standard: {
                    url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@db7f32d9be/samples/graphics/human-anatomy-tiles/{zoom}/{x}/{y}.png',
                    minZoom: 1,
                    maxZoom: 3
                }
            };
            this.initialProjectionName = 'WebMercator'; // fake projection
            this.defaultCredits =
                '<a href="https://www.freepik.com/free-photo/human-body-running_1036783.htm#query=human%20anatomy&position=40&from_view=search&track=ais">Image by kjpargeter</a> on Freepik';
        }
    }

    H.TilesProviderRegistry.CustomProvider =
        CustomProviderDefinition;
}(Highcharts));

Highcharts.mapChart('container', {
    title: {
        text: 'Simple Anatomy Explorer'
    },

    subtitle: {
        text: 'Highcharts Maps with TiledWebMapSeries<br>' +
            'Zoom in to see aspects of the anatomy'
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
        maxZoom: 3
    },

    legend: {
        enabled: false
    },

    tooltip: {
        enabled: true,
        headerFormat: '',
        pointFormat: '{point.name}'
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            type: 'CustomProvider',
            theme: 'Standard'
        }
    }, {
        type: 'map',
        color: 'transparent',
        borderWidth: 0,
        data: [{
            name: 'Head and neck',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-58, 81.2],
                    [-19.6, 81.2],
                    [-15, 74.5],
                    [-54, 69]
                ]]
            }
        }, {
            name: 'Upper torso',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-43.36, 71.41],
                    [4.5, 74],
                    [7, 49],
                    [-30.8, 40.6]
                ]]
            }
        }, {
            name: 'Right arm and hand',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-73.4, 65.5],
                    [-53.6, 63.4],
                    [-57, 57],
                    [-45, 50],
                    [-37.2, 60],
                    [-31, 40],
                    [-45, 29],
                    [-79, 56]
                ]]
            }
        }, {
            name: 'Left arm and hand',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [4.5, 74],
                    [42, 64],
                    [39, 29],
                    [22, 26],
                    [15, 40.25],
                    [24, 46],
                    [23, 59],
                    [6.6, 63.5]
                ]]
            }
        }, {
            name: 'Bottom torso',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-30.8, 40.6],
                    [7, 49],
                    [30.6, 0.72],
                    [-11, -2]
                ]]
            }
        }, {
            name: 'Legs and feet',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-18.9, 15.3],
                    [-11, -2],
                    [30.6, 0.72],
                    [57, -40],
                    [100, -70],
                    [100, -84.5],
                    [-20, -84.5],
                    [-20, -65],
                    [-64, -32],
                    [-45, 4]
                ]]
            }
        }]
    }]
});
