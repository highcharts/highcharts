(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            events: {
                load() {
                    const chart = this,
                        providerSelect = document.getElementById('provider'),
                        themeSelect = document.getElementById('theme'),
                        apikeyInput = document.getElementById('apikey'),
                        submitAPIkeyBtn = document.getElementById('submitAPIkey'),
                        { TilesProvidersRegistry } = Highcharts;

                    function updateTWM() {
                        chart.series[0].update({
                            provider: {
                                type: providerSelect.value,
                                theme: themeSelect.value,
                                apiKey: apikeyInput.value
                            }
                        });
                    }

                    function loadThemes(key) {
                        const {
                            themes
                        } = new TilesProvidersRegistry[key]();
                        Object.keys(themes).forEach(themeKey => {
                            const themeOpt = document.createElement('option');
                            themeOpt.value = themeKey;
                            themeOpt.innerHTML = themeKey;
                            themeSelect.appendChild(themeOpt);
                        });
                    }

                    Object.keys(TilesProvidersRegistry).forEach(key => {
                        const providerOpt = document.createElement('option');
                        providerOpt.value = key;
                        providerOpt.innerHTML = key;
                        providerSelect.appendChild(providerOpt);
                    });
                    loadThemes(providerSelect.value);

                    providerSelect.addEventListener('change', function () {
                        apikeyInput.value = '';
                        themeSelect.innerHTML = '';
                        loadThemes(this.value);
                        updateTWM();
                    });
                    themeSelect.addEventListener('change', updateTWM);
                    submitAPIkeyBtn.addEventListener('click', updateTWM);
                }
            }
        },
        title: {
            text: 'Highcharts Maps TiledWebMap Series'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            zoom: 3
        },

        series: [{
            type: 'tiledwebmap',
            name: 'TWM Tiles',
            provider: {
                type: 'OpenStreetMap'
            }
        }, {
            type: 'mappoint',
            name: 'Mappoints',
            enableMouseTracking: false,
            states: {
                inactive: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: true
            },
            data: [{
                name: 'London',
                lat: 51.507222,
                lon: -0.1275
            }, {
                name: 'Vik i Sogn',
                lat: 61.087220,
                lon: 6.579700
            }, {
                name: 'Krakow',
                lon: 19.944981,
                lat: 50.064651
            }, {
                name: 'Kowloon',
                lon: 114.183,
                lat: 22.317
            }, {
                name: 'Windhoek',
                lat: -22.55900,
                lon: 17.06429
            }, {
                name: 'Doha',
                lat: 25.28547,
                lon: 51.53037
            }, {
                name: 'Vancouver',
                lat: 49.28315,
                lon: -123.12202
            }]
        }, {
            type: 'mapline',
            color: 'black',
            name: 'Maplines',
            states: {
                inactive: {
                    enabled: false
                }
            },
            data: [{
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [-123.12202, 49.28315], // Vancouver
                        [-0.1275, 51.507222] // London
                    ]
                }
            },
            {
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [51.53037, 25.28547], // Doha
                        [114.183, 22.317] // Kowloon
                    ]
                }
            }
            ],
            lineWidth: 2,
            enableMouseTracking: false
        }, {
            data,
            mapData,
            type: 'map',
            zIndex: -1,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: 'rgba(255, 80, 0, 0.5)'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            },
            color: 'transparent',
            nullColor: 'transparent',
            borderColor: 'rgb(255, 80, 0)',
            showInLegend: false
        }]
    });
})();
