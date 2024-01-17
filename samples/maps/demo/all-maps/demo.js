/**
 * This is a complicated demo of Highcharts Maps, not intended to get you up to
 * speed quickly, but to show off some basic maps and features in one single
 * place. For the basic demo, check out
 * https://www.highcharts.com/demo/maps/tooltip instead.
 *
 */

// Get all HTML elements
const datalist = document.getElementById('maps'),
    input = document.getElementById('map-datalist-input'),
    prevMapButton = document.getElementById('prev-map-btn'),
    nextMapButton = document.getElementById('next-map-btn'),
    dataLabelsCheckbox = document.getElementById('datalabels-checkbox'),
    mapNameHeader = document.getElementById('map-name-header'),
    cleanDemoButton = document.getElementById('clean-demo-btn'),
    svgLink = document.getElementById('svg-link'),
    geojsonLink = document.getElementById('geojson-link'),
    topojsonLink = document.getElementById('topojson-link'),
    javascriptLink = document.getElementById('javascript-link');

// Base path to maps
const baseMapPath = 'https://code.highcharts.com/mapdata/',
    options = [], // Options elements
    allMaps = {};

// Populate dropdown options
for (const [mapGroup, maps] of Object.entries(Highcharts.mapDataIndex)) {
    if (mapGroup !== 'version') {
        Highcharts.merge(true, allMaps, maps);
    }
}

for (const [desc, path] of Object.entries(allMaps)) {
    const option = document.createElement('option');
    option.value = desc; // Display name
    option.dataset.value = path; // Desired value
    options.push(option);
}

datalist.append(...options);

const searchText = `Search ${Object.keys(options).length} maps`;
input.placeholder = searchText;

// Helper functions
function setAttributes(el, attrs) {
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            el.setAttribute(key, attrs[key]);
        }
    }
}

function fillInfo(mapName, mapKey) {
    const paths = [{
        type: 'svg',
        elem: svgLink,
        path: `${baseMapPath}${mapKey}.svg`
    }, {
        type: 'geojson',
        elem: geojsonLink,
        path: `${baseMapPath}${mapKey}.geo.json`
    }, {
        type: 'topojson',
        elem: topojsonLink,
        path: `${baseMapPath}${mapKey}.topo.json`
    }, {
        type: 'javascript',
        elem: javascriptLink,
        path: `${baseMapPath}${mapKey}.js`
    }];

    paths.forEach(({
        elem,
        path
    }) => {
        setAttributes(elem, {
            href: path
        });
    });

    setAttributes(cleanDemoButton, {
        href: `https://jsfiddle.net/gh/get/jquery/1.11.0/highcharts/highcharts/tree/master/samples/mapdata/${mapKey}`
    });

    mapNameHeader.innerText = mapName;
}

function resetDrilldown(chart) {
    // Reset drilldown functionalities
    if (chart.breadcrumbs && chart.breadcrumbs.elementList[0]) {
        chart.breadcrumbs.destroy();
        delete chart.breadcrumbs;
        delete chart.drilldown;
        delete chart.drilldownLevels;
    }
}

// Initial creation of the chart
(async () => {
    const initialMapName = 'World, Miller projection, medium resolution',
        initialMapKey = 'custom/world',
        mapData = await fetch(`https://code.highcharts.com/mapdata/${initialMapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

    fillInfo(initialMapName, initialMapKey);

    // On point click, look for a detailed map to drill into
    const drilldown = async function (e) {
        const map = Object.entries(allMaps).find(map =>
            map[0].indexOf(e.point.name) === 0);
        if (!e.seriesOptions && map) {
            const chart = this,
                mapName = map[0],
                mapKey = map[1].slice(0, -3);

            // Handle error, the timeout is cleared on success
            let fail = setTimeout(() => {
                if (!Highcharts.maps[mapKey]) {
                    chart.showLoading('<i class="fa fa-frown"></i> Map not found');
                    fail = setTimeout(() => {
                        chart.hideLoading();
                    }, 1000);
                }
            }, 3000);

            // Show the Font Awesome spinner
            chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');

            fillInfo(mapName, mapKey);
            input.value = mapName;
            prevMapButton.style.opacity = 1;
            nextMapButton.style.opacity = 1;

            // Load the drilldown map
            const topology = await fetch(
                `https://code.highcharts.com/mapdata/${mapKey}.topo.json`
            ).then(response => response.json());

            const data =
                topology.objects.default.geometries.map((g, value) => ({
                    key: g.properties['hc-key'],
                    drilldown: g.properties['hc-key'],
                    value
                }));

            // Apply the recommended map view if any
            chart.mapView.update(
                Highcharts.merge({
                    insets: undefined,
                    padding: 0
                },
                topology.objects.default['hc-recommended-mapview']
                )
            );
            // Hide loading and add series
            chart.hideLoading();
            clearTimeout(fail);
            chart.addSeriesAsDrilldown(e.point, {
                mapData: topology,
                name: e.point.name,
                data,
                joinBy: ['hc-key', 'key'],
                custom: {
                    mapView: topology.objects.default['hc-recommended-mapview'],
                    mapName,
                    mapKey
                }
            });
        }
    };

    // On drill up, reset to the top-level map view
    const afterDrillUp = function (e) {
        const {
            mapView,
            mapName,
            mapKey
        } = e.seriesOptions.custom;
        if (mapView && mapName && mapKey) {
            fillInfo(mapName, mapKey);
            input.value = mapName;

            e.target.mapView.update(
                Highcharts.merge({
                    insets: undefined
                },
                e.seriesOptions.custom.mapView
                ),
                false
            );
        }
    };

    const data = mapData.objects.default.geometries.map((g, value) => ({
            key: g.properties['hc-key'],
            drilldown: g.properties['hc-key'],
            value
        })),
        mapView = Highcharts.merge({
            projection: {
                name: 'Miller',
                rotation: [0]
            }
        },
        mapData.objects.default['hc-recommended-mapview']
        );

    console.time('map');
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: mapData,
            events: {
                drilldown,
                afterDrillUp
            }
        },

        title: {
            text: null
        },

        accessibility: {
            series: {
                descriptionFormat: '{series.name}, map with {series.points.length} areas.',
                pointDescriptionEnabledThreshold: 50
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                x: 10
            }
        },

        mapView,

        colorAxis: {
            min: 0,
            stops: [
                [0, '#EFEFFF'],
                [0.5, Highcharts.getOptions().colors[0]],
                [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                        .brighten(-0.5).get()
                ]
            ]
        },

        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom'
        },

        series: [{
            data,
            joinBy: ['hc-key', 'key'],
            name: initialMapName,
            dataLabels: {
                enabled: false,
                formatter: function () {
                    return this.point.properties && this.point.properties['hc-a2'];
                }
            },
            custom: {
                mapView,
                mapName: initialMapName,
                mapKey: initialMapKey
            }
        }]
    });
    console.timeEnd('map');

    async function updateChart(mapName) {
        const mapKey = allMaps[mapName].slice(0, -3);

        // Show loading
        chart.showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');

        fillInfo(mapName, mapKey);

        const mapData = await fetch(`${baseMapPath}${mapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

        if (!mapData) {
            chart.showLoading('<i class="fa fa-frown"></i> Map not found');
            return;
        }

        // Data labels formatter. Use shorthand codes for world and US
        const formatter = function () {
            return (
                mapKey === 'custom/world' ||
                mapKey === 'countries/us/us-all'
            ) ?
                (this.point.properties && this.point.properties['hc-a2']) :
                this.point.name;
        };

        const data = mapData.objects.default.geometries.map((g, value) => ({
                key: g.properties['hc-key'],
                drilldown: g.properties['hc-key'],
                value
            })),
            mapView = Highcharts.merge({
                projection: {
                    name: 'Miller',
                    rotation: [0]
                },
                insets: undefined
            },
            mapData.objects.default['hc-recommended-mapview']
            );
        chart.update({
            mapView
        }, false);
        chart.series[0].update({
            mapData,
            data,
            name: mapName,
            dataLabels: {
                formatter
            },
            custom: {
                mapView,
                mapName,
                mapKey
            }
        });
        chart.hideLoading();
    }

    // Change map on input change
    input.addEventListener('input', async function () {
        if (allMaps[this.value]) {
            prevMapButton.style.opacity = 1;
            nextMapButton.style.opacity = 1;
            resetDrilldown(chart);
            updateChart(this.value);
        }
    });

    // Toggle data labels
    dataLabelsCheckbox.addEventListener('click', function () {
        chart.series[0].update({
            dataLabels: {
                enabled: this.checked
            }
        });
    });

    // Switch to previous map on button click
    prevMapButton.addEventListener('click', function () {
        const desiredIndex = Object.keys(allMaps).indexOf(input.value) - 1,
            [mapName] = Object.entries(allMaps)[
                desiredIndex < 0 ?
                    Object.keys(allMaps).length - 1 :
                    desiredIndex
            ];
        resetDrilldown(chart);
        updateChart(mapName);
        input.value = mapName;
    });

    // Switch to next map on button click
    nextMapButton.addEventListener('click', function () {
        const desiredIndex = Object.keys(allMaps).indexOf(input.value) + 1,
            [mapName] = Object.entries(allMaps)[
                desiredIndex > Object.keys(allMaps).length - 1 ?
                    0 :
                    desiredIndex
            ];
        resetDrilldown(chart);
        updateChart(mapName);
        input.value = mapName;
    });
})();
