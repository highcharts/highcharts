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
        path: `${baseMapPath}${allMaps[this.value]}`
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

    mapNameHeader.innerHTML = mapName;
}

// Initial creation of the chart
(async () => {
    const initialMapName = 'World, Miller projection, medium resolution',
        initialMapKey = 'custom/world',
        mapData = await fetch(`https://code.highcharts.com/mapdata/${initialMapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

    fillInfo(initialMapName, initialMapKey);

    const data = mapData.objects.default.geometries.map((g, value) => ({
        key: g.properties['hc-key'],
        value
    }));

    console.time('map');
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: mapData
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

        mapView: {
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Alaska west
                    [-164, 54],
                    // Greenland north
                    [-35, 84],
                    // New Zealand east
                    [179, -38],
                    // Chile south
                    [-68, -55]
                ]
            }
        },

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
            name: 'Random data',
            dataLabels: {
                enabled: false,
                formatter: function () {
                    return this.point.properties && this.point.properties['hc-a2'];
                },
                style: {
                    fontWeight: 100,
                    fontSize: '10px',
                    textOutline: 'none'
                }
            },
            point: {
                events: {
                // click: onPointClick
                }
            }
        }, {
            type: 'mapline',
            name: 'Lines',
            accessibility: {
                enabled: false
            },
            data: Highcharts.geojson(mapData, 'mapline'),
            /*
            data: [{
                geometry: mapData.objects.default['hc-recommended-mapview']
                    .insets[0].geoBounds
            }],
            */
            nullColor: '#333333',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
    console.timeEnd('map');

    async function updateChart(mapName) {
        const mapKey = allMaps[mapName].slice(0, -3);

        // Show loading
        if (Highcharts.charts[0]) {
            Highcharts.charts[0].showLoading(
                '<i class="fa fa-spinner fa-spin fa-2x"></i>'
            );
        }

        fillInfo(mapName, mapKey);

        const mapData = await fetch(`${baseMapPath}${mapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

        if (!mapData) {
            if (Highcharts.charts[0]) {
                Highcharts.charts[0].showLoading(
                    '<i class="fa fa-frown"></i> Map not found'
                );
            }
            return;
        }

        const fitToGeometry = (mapKey === 'custom/world') ? {
            type: 'MultiPoint',
            coordinates: [
                // Alaska west
                [-164, 54],
                // Greenland north
                [-35, 84],
                // New Zealand east
                [179, -38],
                // Chile south
                [-68, -55]
            ]
        } : undefined;

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
            value
        }));
        chart.update({
            mapView: {
                fitToGeometry
            }
        }, false);
        chart.series[0].update({
            mapData,
            data,
            dataLabels: {
                formatter
            }
        }, false);
        chart.series[1].update({
            data: Highcharts.geojson(mapData, 'mapline')
            /*
            data: [{
                geometry: mapData.objects.default['hc-recommended-mapview']
                    .insets[0].geoBounds
            }],
            */
        });
        chart.hideLoading();
    }

    // Change map on input change
    input.addEventListener('input', async function () {
        if (allMaps[this.value]) {
            Array.from(document.getElementsByClassName('prev-next')).forEach(el => {
                el.style.opacity = 1;
            });
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
        updateChart(mapName);
        input.value = mapName;
    });
})();
