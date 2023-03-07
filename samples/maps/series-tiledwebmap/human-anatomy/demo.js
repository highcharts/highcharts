(function (H) {
    class CustomProviderDefinition {
        constructor() {
            this.themes = {
                Female: {
                    url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@b58f45082b/samples/graphics/human-anatomy-tiles/female/{zoom}/{x}/{y}.png',
                    minZoom: 1,
                    maxZoom: 3
                },
                Male: {
                    url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@b58f45082b/samples/graphics/human-anatomy-tiles/male/{zoom}/{x}/{y}.png',
                    minZoom: 1,
                    maxZoom: 3
                }
            };
            this.initialProjectionName = 'WebMercator'; // fake projection
            this.defaultCredits =
                'Images from <a href="https://www.innerbody.com/">innerbody</a>';
        }
    }

    H.TilesProvidersRegistry.CustomProvider =
        CustomProviderDefinition;
}(Highcharts));

Highcharts.mapChart('container', {
    chart: {
        events: {
            load() {
                const chart = this,
                    twmSeries = chart.series[0],
                    btn = document.getElementById('switchGender');

                btn.addEventListener('click', function () {
                    const newTheme =
                        twmSeries.options.provider.theme === 'Female' ?
                            'Male' : 'Female';
                    twmSeries.update({
                        provider: {
                            theme: newTheme
                        }
                    });
                });
            }
        }
    },

    title: {
        text: 'Simple Anatomy Explorer'
    },

    subtitle: {
        text: 'Highcharts Maps with TiledWebMapSeries'
    },

    mapNavigation: {
        enabled: true
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
            theme: 'Female'
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
                    [-18, 84.2],
                    [20, 84.2],
                    [20, 76.5],
                    [-18, 76.5]
                ]]
            }
        }, {
            name: 'Upper torso',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-25, 75],
                    [25, 75],
                    [25, 50],
                    [-25, 50]
                ]]
            }
        }, {
            name: 'Arms and hands',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [25, 75],
                    [40, 73],
                    [43, 45],
                    [62, -30],
                    [37, -30],
                    [38, 0],
                    [30, 40],
                    [27, 49],
                    [25, 75],
                    [-25, 75],
                    [-40, 73],
                    [-43, 45],
                    [-62, -30],
                    [-37, -30],
                    [-38, 0],
                    [-30, 40],
                    [-27, 49],
                    [-25, 75]
                ]]
            }
        }, {
            name: 'Bottom torso',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-25, 50],
                    [25, 50],
                    [35, -10],
                    [-35, -10]
                ]]
            }
        }, {
            name: 'Legs and foots',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [-35, -10],
                    [35, -10],
                    [25, -84.5],
                    [-25, -84.5]
                ]]
            }
        }]
    }]
});
