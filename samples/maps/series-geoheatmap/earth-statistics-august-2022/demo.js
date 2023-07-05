(async () => {

    const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json()),
        data = [{
            type: 'Land Surface (day) and Sea Temperature',
            title: 'Land Surface (day) and Sea Temperature in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@sha/samples/data/geoheatmap-land-sea-day-temp-august_2022.json',
            colorAxis: {
                min: -25,
                max: 50,
                labels: {
                    format: '{value}°C',
                    style: {
                        color: '#fff'
                    }
                },
                stops: [
                    [0, '#c0fbfa'],
                    [0.15, '#3562d7'],
                    [0.45, '#d400a0'],
                    [0.55, '#f40001'],
                    [0.75, '#f67700'],
                    [1, '#f6ec69']
                ]
            },
            data: void 0
        }, {
            type: 'Land Surface (night) and Sea Temperature',
            title: 'Land Surface (night) and Sea Temperature in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@sha/samples/data/geoheatmap-land-sea-night-temp-august_2022.json',
            colorAxis: {
                min: -25,
                max: 50,
                labels: {
                    format: '{value} °C',
                    style: {
                        color: '#fff'
                    }
                },
                stops: [
                    [0, '#c0fbfa'],
                    [0.15, '#3562d7'],
                    [0.45, '#d400a0'],
                    [0.55, '#f40001'],
                    [0.75, '#f67700'],
                    [1, '#f6ec69']
                ]
            },
            data: void 0
        }, {
            type: 'Net Radiation',
            title: 'Net radiation in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@c8a1a20e44/samples/data/net_radiation_august_2022.json',
            colorAxis: {
                min: -200,
                max: 200,
                labels: {
                    format: '{value} W/m²',
                    style: {
                        color: '#fff'
                    }
                },
                stops: [
                    [0, '#358abc'],
                    [0.5, '#fcffbd'],
                    [1, '#d64050']
                ]
            },
            data: void 0
        }, {
            type: 'Vegetation Index (NDVI)',
            title: 'Vegetation Index (NDVI) in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@c8a1a20e44/samples/data/ndvi_august_2022.json',
            colorAxis: {
                min: 0,
                max: 1,
                labels: {
                    format: '{value}',
                    style: {
                        color: '#fff'
                    }
                },
                stops: [
                    [0, '#eee7e6'],
                    [0.5, '#7a963c'],
                    [1, '#04360a']
                ]
            },
            data: void 0
        }];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            backgroundColor: '#000',
            events: {
                load() {
                    const chart = this,
                        geoheatmap = chart.series[0],
                        datasetSelect = document.getElementById('dataset');

                    data.forEach(el => {
                        const option = document.createElement('option');
                        option.value = el.type;
                        option.innerHTML = el.type;
                        datasetSelect.appendChild(option);
                    });

                    // Show the Font Awesome spinner
                    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i><br/><i>Loading data...</i>');

                    async function getDataset(type) {
                        const dataset = data.find(el => el.type === type);

                        if (typeof dataset.data === 'undefined') {
                            const apiData = await fetch(dataset.url)
                                .then(response => response.json());
                            dataset.data = apiData;
                        }

                        // Hide loading
                        chart.hideLoading();
                        chart.title.update({
                            text: dataset.title
                        }, false);
                        chart.colorAxis[0].update(dataset.colorAxis, false);
                        geoheatmap.setData(dataset.data);
                    }

                    datasetSelect.addEventListener('change', function () {
                        // Show the Font Awesome spinner
                        chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i><br/><i>Loading data...</i>');
                        getDataset(datasetSelect.value);
                    });

                    getDataset(datasetSelect.value);
                }
            }
        },

        title: {
            text: 'Land Surface Temperature (day) in August 2022',
            style: {
                color: '#fff'
            }
        },

        subtitle: {
            text: 'Data source: <a style="color: #ddd" href="https://neo.gsfc.nasa.gov/">NEO Nasa Earth Observations</a>',
            style: {
                color: '#fff'
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            center: [0, 0],
            zoom: 1.5
        },

        legend: {
            symbolWidth: 350
        },

        loading: {
            labelStyle: {
                color: 'white'
            },
            style: {
                backgroundColor: 'rgba(0,0,0,0)'
            }
        },

        colorAxis: {},

        tooltip: {
            headerFormat: '<span style="font-size: 11px">Lon: {point.point.lon}° Lat: {point.point.lat}°</span><br/>',
            pointFormatter() {
                return `Value: ${this.options.value.toFixed(2)}`;
            },
            enabled: false
        },

        plotOptions: {
            mapline: {
                enableMouseTracking: false,
                joinBy: ['iso-a2', 'code'],
                fillColor: 'transparent',
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            }
        },

        series: [{
            name: 'GeoHeatMap series',
            type: 'geoheatmap',
            interpolation: true,
            interpolationBlur: 1
        }, {
            nullColor: '#383838',
            type: 'mapline',
            name: 'Outlines of the Continents',
            data: Highcharts.geojson(topology)
        }]
    });

})();
