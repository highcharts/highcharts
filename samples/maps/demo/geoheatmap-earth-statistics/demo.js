(async () => {

    const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
        ).then(response => response.json()),
        landDayData = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@ff78574898/samples/data/geoheatmap-land-sea-day-temp-august-2022.json'
        ).then(response => response.json()),
        datasets = [{
            type: 'Land Surface (day) and Sea Temperature',
            title: 'Land Surface (day) and Sea Temperature in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@ff78574898/samples/data/geoheatmap-land-sea-day-temp-august-2022.json',
            colorAxis: {
                min: -20,
                max: 40,
                labels: {
                    format: '{value}°C',
                    style: {
                        color: '#fff'
                    }
                },
                stops: [
                    [0, '#9589d3'],
                    [0.16, '#7cc4be'],
                    [0.33, '#5d8bbe'],
                    [0.5, '#688f2c'],
                    [0.66, '#dbac0b'],
                    [0.83, '#e75e14'],
                    [1, '#852809']
                ]
            },
            data: landDayData
        }, {
            type: 'Land Surface (night) and Sea Temperature',
            title: 'Land Surface (night) and Sea Temperature in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@ff78574898/samples/data/geoheatmap-land-sea-night-temp-august-2022.json',
            colorAxis: {
                min: -20,
                max: 40,
                labels: {
                    format: '{value} °C',
                    style: {
                        color: '#fff'
                    }
                },
                stops: [
                    [0, '#9589d3'],
                    [0.16, '#7cc4be'],
                    [0.33, '#5d8bbe'],
                    [0.5, '#688f2c'],
                    [0.66, '#dbac0b'],
                    [0.83, '#e75e14'],
                    [1, '#852809']
                ]
            },
            data: void 0
        }, {
            type: 'Net Radiation',
            title: 'Net radiation in August 2022',
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@ff78574898/samples/data/net-radiation-august-2022.json',
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
            url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@ff78574898/samples/data/ndvi-august-2022.json',
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
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: topology,
            backgroundColor: '#000'
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

        colorAxis: {
            gridLineColor: '#000'
        },

        tooltip: {
            headerFormat: '<span style="font-size: 11px">Lon: {point.point.lon}° Lat: {point.point.lat}°</span><br/>',
            pointFormat: 'Value: {point.value:.2f}'
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
            interpolation: {
                enabled: true
            }
        }, {
            nullColor: '#383838',
            type: 'mapline',
            name: 'Outlines of the Continents',
            data: Highcharts.geojson(topology)
        }]
    });

    const geoheatmap = chart.series[0],
        datasetSelect = document.getElementById('dataset');

    datasets.forEach(el => {
        const option = document.createElement('option');
        option.value = el.type;
        option.innerHTML = el.type;
        datasetSelect.appendChild(option);
    });

    // Show the Font Awesome spinner
    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i><br/><i>Loading data...</i>');

    async function getDataset(type) {
        const dataset = datasets.find(el => el.type === type);

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
        geoheatmap.setData(dataset.data, true, {
            complete() {
                // Hide loading on complete
                chart.hideLoading();
            }
        });
    }

    datasetSelect.addEventListener('change', function () {
        // Show the Font Awesome spinner
        chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i><br/><i>Loading data...</i>');
        setTimeout(function () {
            getDataset(datasetSelect.value);
        }, 0);
    });

    setTimeout(function () {
        getDataset(datasetSelect.value);
    }, 0);

})();
